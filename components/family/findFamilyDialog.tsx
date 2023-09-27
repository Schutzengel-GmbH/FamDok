import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useState, useEffect } from "react";
import { getAge, getFamilyString } from "@/utils/utils";
import { IFamilies } from "@/pages/api/families";
import { FullFamily } from "@/types/prismaHelperTypes";
import useToast from "@/components/notifications/notificationContext";

type FindFamilyDialogProps = {
  open: boolean;
  onConfirm: (
    family: Prisma.FamilyGetPayload<{
      include: { caregivers: true; children: true };
    }>
  ) => void;
  onCancel: () => void;
  hideClosedFamilies?: boolean;
};

export default function FindFamilyDialog({
  hideClosedFamilies,
  open,
  onConfirm,
  onCancel,
}: FindFamilyDialogProps) {
  const [families, setFamilies] = useState<FullFamily[]>([]);
  const [family, setFamily] = useState<FullFamily | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchStart, setSearchStart] = useState<string>("");

  const { addToast } = useToast();

  function handleConfirm() {
    onConfirm(family);
  }

  useEffect(() => {
    setSearching(true);
    const fetchData = async () => {
      let start = parseInt(searchStart);
      if (!start || isNaN(start)) {
        return;
      }
      const res = await fetch(
        `/api/families?number=${start}&number=${start + 8}`
      );
      if (res.status !== 200) {
        addToast({
          message: `Fehler beim Abrufen der Familien: Status ${res.status}`,
          severity: "error",
        });
        return;
      }
      const response = (await res.json()) as IFamilies;
      setFamilies(response.families);
    };
    if (searchStart) fetchData();
    setSearching(false);
  }, [searchStart]);

  function handleChange(_: any, value: FullFamily | null) {
    setFamily(value ?? undefined);
  }

  function handleInputChange(_: any, value: string) {
    try {
      parseInt(value);
      setSearchStart(value);
    } catch (e) {
      return;
    }
  }

  return (
    <Dialog maxWidth={"md"} fullWidth open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Autocomplete
          sx={{ mt: ".5rem" }}
          inputValue={searchStart}
          onInputChange={handleInputChange}
          isOptionEqualToValue={(option, value) =>
            option.number === option.number
          }
          getOptionLabel={(family) => getFamilyString(family)}
          value={family ?? null}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="Suche nach Familiennummer" />
          )}
          filterOptions={(options) => options}
          options={families}
        />
        {searching && <CircularProgress />}
        {error && (
          <Alert sx={{ mt: ".5rem" }} severity={"error"}>
            {error}
          </Alert>
        )}
        {family?.endOfCare && (
          <Alert
            sx={{ mt: ".5rem" }}
            severity="warning"
          >{`Familie zum ${new Date(
            family.endOfCare
          ).toLocaleDateString()} abgeschlossen.`}</Alert>
        )}
        {/* {family && <FamilyComponent family={family} />} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Bestätigen</Button>
        <Button onClick={onCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}

