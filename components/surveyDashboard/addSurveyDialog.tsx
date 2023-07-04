import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import useNotification from "../utilityComponents/notificationContext";
import { Prisma } from "@prisma/client";
import { ISurveys } from "../../pages/api/surveys";

export interface AddSurveyDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSurveyDialog({
  open,
  onClose,
}: AddSurveyDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasFamily, setHasFamily] = useState(false);

  const { addAlert } = useNotification();

  function handleName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  function handleDescription(e: ChangeEvent<HTMLInputElement>) {
    setDescription(e.currentTarget.value);
  }

  function clear() {
    setName("");
    setDescription("");
    setHasFamily(false);
  }

  function cancel() {
    clear();
    onClose();
  }

  async function save() {
    const createInput: Prisma.SurveyCreateInput = {
      name,
      description,
      hasFamily,
    };

    await fetch("/api/surveys", {
      method: "POST",
      body: JSON.stringify(createInput),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const response = (await res.json()) as ISurveys;
        if (res.status === 200)
          addAlert({
            message: `${response.survey.name || "Survey"} hinzugefügt`,
            severity: "success",
          });
        else
          addAlert({
            message: `Fehler beim Hinzufügen: ${response.error}`,
            severity: "error",
          });
      })
      .catch((err) => {
        addAlert({
          message: `Fehler beim Hinzufügen: ${err}`,
          severity: "error",
        });
      });
    clear();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>Neue Erhebung erstellen</DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", maxWidth: "800px" }}
        >
          <TextField
            sx={{ mt: ".5rem" }}
            label={"Name"}
            value={name}
            onChange={handleName}
          />
          <TextField
            sx={{ mt: ".5rem" }}
            label={"Beschreibung (optional)"}
            value={description}
            onChange={handleDescription}
          />
          <FormControlLabel
            label="Hat Stammdaten"
            control={
              <Checkbox
                checked={hasFamily}
                onChange={(e) => setHasFamily(e.target.checked)}
              />
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={save}>Hinzufügen</Button>
        <Button onClick={cancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
