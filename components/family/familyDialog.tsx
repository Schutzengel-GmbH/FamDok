import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Caregiver, Child, Family, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import ChildrenComponent from "@/components/family/childrenComponent";
import CaregiversComponent from "@/components/family/caregiversComponent";
import FamilyNumberDialog from "@/components/family/familyNumberDialog";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import { getAddFamilyInput } from "@/utils/utils";
import { useUserData } from "@/utils/authUtils";
import useNotification from "@/components/utilityComponents/notificationContext";
import { FullFamily } from "@/types/prismaHelperTypes";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IFamilies } from "@/pages/api/families";

export type PartialFamily = Partial<
  Family & { children: Partial<Child>[]; caregivers: Partial<Caregiver>[] }
>;

export interface FamilyDialogProps {
  initialFamily:
    | Prisma.FamilyGetPayload<{ include: { children: true; caregivers: true } }>
    | undefined;
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

  const { user } = useUserData();
  const { addAlert } = useNotification();

  useEffect(() => {
    setFamily(initialFamily || {});
  }, [initialFamily]);

  function handleCancel() {
    setFamily(initialFamily || {});
    onClose(initialFamily);
  }

  async function handleSave() {
    const update = getAddFamilyInput(family, user.id);
    if (update.error || !update.familyCreate) {
      addAlert({
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
      addAlert({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addAlert({
          message: `Fehler: ${res.error}`,
          severity: "error",
        });

      addAlert({
        message: `Familie ${res.family.number} erstellt`,
        severity: "success",
      });
      onClose(res.family);
    }
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
            <TextField
              sx={{ marginTop: "1rem" }}
              label="Wohnort"
              value={family.location}
              onChange={(e) =>
                setFamily({ ...family, location: e.currentTarget.value })
              }
            />
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
    </>
  );
}

