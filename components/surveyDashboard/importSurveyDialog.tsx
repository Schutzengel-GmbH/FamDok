import { Check, Error } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export interface ImportSurveyDialogProps {
  open: boolean;
  onClose: () => void;
}

const ImportSurveyDialog = ({ open, onClose }: ImportSurveyDialogProps) => {
  const [createInput, updateCreateInput] = useState<
    Prisma.SurveyCreateInput | undefined
  >();
  const [error, updateError] = useState<string | undefined>();

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    for (const file of e.target.files!) {
      const text = await file.text();

      try {
        updateCreateInput(JSON.parse(text));
      } catch (error) {
        updateError("Dateiformat nicht kompatibel");
      }
    }
  }

  function cancel() {
    updateError(undefined);
    updateCreateInput(undefined);
    onClose();
  }

  async function save() {
    if (!createInput) updateError("keine Datei gewählt");
    else {
      const res = await fetch("/api/surveys/import", {
        method: "POST",
        body: JSON.stringify(createInput),
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        updateError(undefined);
        updateCreateInput(undefined);
        onClose();
        return;
      } else
        updateError(
          "Fehler beim Erstellen, wahrscheinlich ist die Datei korrupt oder es wurde eine falsche Datei gewählt."
        );
    }
  }

  return (
    <Dialog open={open} onClose={onClose} sx={{ width: "100%" }}>
      <DialogTitle>Survey Importieren</DialogTitle>
      <DialogContent>
        {error && (
          <Alert
            sx={{ mt: ".5rem", mb: ".5rem" }}
            variant="filled"
            severity="error"
          >
            <strong>Fehler</strong> {error}
          </Alert>
        )}
        <Button variant="contained" component="label">
          Upload File
          <input type="file" hidden onChange={handleUpload} />
        </Button>
        {!error && createInput && <Check color="success" />}
        {error && <Error color="error" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={save}>Importieren</Button>
        <Button onClick={cancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportSurveyDialog;
