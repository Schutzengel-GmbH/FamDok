import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Caregiver, Child, Family, Prisma, Role, User } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import ChildrenComponent from "@/components/family/childrenComponent";
import CaregiversComponent from "@/components/family/caregiversComponent";
import FamilyNumberDialog from "@/components/family/familyNumberDialog";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import { getAddFamilyInput } from "@/utils/utils";
import { useUserData } from "@/utils/authUtils";
import { FullFamily, FullUser } from "@/types/prismaHelperTypes";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IFamilies } from "@/pages/api/families";
import {
  ApiResponseFamily,
  IFamilyUpdate,
} from "@/pages/api/families/[family]";
import useToast from "@/components/notifications/notificationContext";
import { useComingFromOptions, useLocations } from "@/utils/apiHooks";
import LocationPicker from "@/components/family/pickComponents/locationPickComponent";
import ComingFromOptionPicker from "@/components/family/pickComponents/comingFromPickComponent";
import CreatedByPickComponent from "@/components/family/pickComponents/createdByPickComponent";
import EndOfCareDialog from "@/components/family/endOfCareDialog";

export type PartialFamily = Partial<
  Family & {
    children: Partial<Child>[];
    caregivers: Partial<Caregiver>[];
    createdBy?: FullUser;
  }
>;

export interface FamilyDialogProps {
  initialFamily: FullFamily | undefined;
  open: boolean;
  onClose: (family?: FullFamily) => void;
}

export default function FamilyDialog({
  open,
  onClose,
  initialFamily,
}: FamilyDialogProps) {
  const [family, setFamily] = useState<PartialFamily>({});
  const [famNumberCreated, setFamNumberCreated] = useState<number>();

  const [endOfCareDialogOpen, setEndOfCareDialogOpen] = useState(false);

  const { user } = useUserData();
  const { addToast } = useToast();
  const { isLoading, locations } = useLocations();
  const { isLoading: comingFromIsLoading, comingFromOptions } =
    useComingFromOptions();

  const { user: createdBy } = useUserData(family.userId);

  useEffect(() => {
    setFamily(initialFamily || {});
  }, [initialFamily]);

  function handleCancel(e: MouseEvent) {
    e.stopPropagation();
    setFamily(initialFamily || {});
    onClose(initialFamily);
  }

  function getUpdateInput() {
    let update: IFamilyUpdate = {};

    update.childrenToDelete = initialFamily.children
      .filter((c) => family.children.findIndex((cu) => cu.id === c.id) < 0)
      .map((c) => ({ id: c.id }));

    update.caregiverIdsToDelete = initialFamily.caregivers
      .filter((c) => family.caregivers.findIndex((cu) => cu.id === c.id) < 0)
      .map((c) => ({ id: c.id }));

    update.childrenToAdd = family.children
      .filter((c) => c.id === undefined)
      .map((c) => ({ ...c, familyId: initialFamily.id }));

    update.caregiversToAdd = family.caregivers
      .filter((c) => c.id === undefined)
      .map((c) => ({ ...c, familyId: initialFamily.id }));

    update.childrenToUpdate = family.children.filter((c) => c.id !== undefined);

    update.caregiversToUpdate = family.caregivers.filter(
      (c) => c.id !== undefined
    );

    const fields = Object.keys(initialFamily);
    update.familyUpdate = {};

    for (let field of fields) {
      if (initialFamily[field] !== family[field])
        update.familyUpdate[field] = family[field];
    }

    if (family.createdBy && family.createdBy !== createdBy)
      update.familyUpdate.createdBy = { connect: { id: family.createdBy.id } };

    delete update.familyUpdate.children;
    delete update.familyUpdate.caregivers;
    delete update.familyUpdate.createdAt;
    delete update.familyUpdate.updatedAt;
    delete update.familyUpdate.Response;

    return update;
  }

  async function handleSave(e: MouseEvent) {
    e.stopPropagation();
    if (!initialFamily) {
      const update = getAddFamilyInput(family, user.id);
      if (update.error || !update.familyCreate) {
        addToast({
          message:
            update.errorMessage || "Es ist ein unerwarteter Fehler aufgetreten",
          severity: "error",
        });
        return;
      }
      const res = await apiPostJson<IFamilies>(
        "/api/families",
        update.familyCreate
      );
      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          addToast({
            message: `Familie ${res.family.number} erstellt`,
            severity: "success",
          });

          setFamNumberCreated(res.family.number);
        }

        onClose(res.family);
      }
    } else {
      const res = await apiPostJson<ApiResponseFamily>(
        `/api/families/${initialFamily.id}`,
        getUpdateInput()
      );

      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });

        addToast({
          message: `Familie ${res.family?.number} geändert`,
          severity: "success",
        });
        onClose(res.family);
      }
    }
    setFamily({});
  }

  return (
    <>
      <FamilyNumberDialog
        familyNumber={famNumberCreated}
        open={famNumberCreated !== undefined}
        onClose={() => setFamNumberCreated(undefined)}
      />
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") onClose();
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>
          {initialFamily ? `Familie bearbeiten` : "Neue Familie erstellen"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", maxWidth: "800px" }}
          >
            <Typography variant="body2">{`Familiennummer: ${family.number}`}</Typography>
            <DatePickerComponent
              sx={{ marginTop: "1rem" }}
              label="Beginn der Betreuung"
              currentAnswer={family.beginOfCare}
              onChange={(value, error) => {
                if (error) {
                  //TODO: handle error
                  return;
                } else {
                  setFamily({ ...family, beginOfCare: value });
                }
              }}
            />
            {family.endOfCare && (
              <DatePickerComponent
                sx={{ marginTop: "1rem" }}
                label="Ende der Betreuung"
                currentAnswer={family.endOfCare}
                onChange={(value, error) => {
                  if (error) {
                    //TODO: handle error
                    return;
                  } else {
                    setFamily({ ...family, endOfCare: value });
                  }
                }}
              />
            )}
            {!family.endOfCare && (
              <Button
                sx={{ marginTop: "1rem" }}
                variant={"outlined"}
                onClick={() => setEndOfCareDialogOpen(true)}
              >
                Betreuung beenden
              </Button>
            )}
            {isLoading || (comingFromIsLoading && <CircularProgress />)}
            {!isLoading && locations.length == 0 && (
              <TextField
                sx={{ marginTop: "1rem" }}
                label="Wohnort"
                value={family.location || ""}
                onChange={(e) =>
                  setFamily({ ...family, location: e.currentTarget.value })
                }
              />
            )}
            {!isLoading && locations?.length > 0 && (
              <LocationPicker
                sx={{ marginTop: "1rem" }}
                locations={locations}
                value={family.location}
                onChange={(location) => setFamily({ ...family, location })}
              />
            )}
            {!comingFromIsLoading && comingFromOptions.length == 0 && (
              <TextField
                sx={{ marginTop: "1rem" }}
                label="Zugang über"
                value={family.comingFromOtherValue}
                onChange={(e) =>
                  setFamily({
                    ...family,
                    comingFromOtherValue: e.currentTarget.value,
                  })
                }
              />
            )}
            {!comingFromIsLoading && comingFromOptions?.length > 0 && (
              <ComingFromOptionPicker
                sx={{ marginTop: "1rem" }}
                comingFromOptions={comingFromOptions}
                optionId={family.comingFromOptionId}
                onChange={(comingFrom) =>
                  setFamily({
                    ...family,
                    comingFromOptionId: comingFrom?.id || null,
                  })
                }
              />
            )}
            <CaregiversComponent
              value={family.caregivers || []}
              onChange={(c) => setFamily({ ...family, caregivers: c })}
            />
            <TextField
              sx={{ marginTop: "1rem" }}
              label="Anzahl Kinder"
              inputMode="numeric"
              value={family.childrenInHousehold}
              onChange={(e) =>
                setFamily({
                  ...family,
                  childrenInHousehold: parseInt(e.currentTarget.value),
                })
              }
            />
            <ChildrenComponent
              value={family.children || []}
              onChange={(c) => setFamily({ ...family, children: c })}
            />
            {user?.role === Role.USER && family.userId && createdBy?.name && (
              <Typography sx={{ mt: "1rem" }}>
                Verantwortlich: {createdBy.name}
              </Typography>
            )}
            {user?.role !== Role.USER && (
              <CreatedByPickComponent
                value={family.createdBy ?? createdBy}
                onChange={(u) => setFamily({ ...family, createdBy: u })}
                sx={{ mt: "1rem" }}
              />
            )}
            <TextField
              sx={{ marginTop: "1rem" }}
              label="Andere installierte Fachkräfte"
              value={family.otherInstalledProfessionals}
              onChange={(e) =>
                setFamily({
                  ...family,
                  otherInstalledProfessionals: e.currentTarget.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ marginTop: ".5rem" }}
            //disabled={!answersChanged || inputErrors}
            onClick={handleSave}
            variant="outlined"
            disabled={
              initialFamily && user.role === "USER" && user.id !== family.userId
            }
          >
            Speichern
          </Button>
          <Button
            sx={{ marginTop: ".5rem", marginLeft: ".5rem" }}
            onClick={handleCancel}
            variant="outlined"
          >
            Abbrechen und zurück
          </Button>
        </DialogActions>
      </Dialog>
      <EndOfCareDialog
        family={family}
        open={endOfCareDialogOpen}
        onClose={() => setEndOfCareDialogOpen(false)}
      />
    </>
  );
}
