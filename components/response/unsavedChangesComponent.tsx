import { Alert, Button, Paper } from "@mui/material";

type UnsavedChangesComponentProps = {
  unsavedChanges: boolean;
  errors?: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function UnsavedChangesComponent({
  unsavedChanges,
  errors,
  onSave,
  onCancel,
}: UnsavedChangesComponentProps) {
  return (
    <Paper
      sx={
        unsavedChanges
          ? {
              top: ".5rem",
              zIndex: "100",
              p: ".5rem",
              minWidth: "80%",
            }
          : { display: "none" }
      }
      elevation={3}
    >
      {!errors && (
        <Alert severity={"warning"}>
          Es liegen noch nicht gespeicherte Änderungen vor!
        </Alert>
      )}
      {errors && <Alert severity={"error"}>Es liegen noch Fehler vor!</Alert>}
      <Button
        sx={{ marginTop: ".5rem", mr: ".5rem" }}
        variant="outlined"
        onClick={onSave}
        disabled={errors}
      >
        Speichern
      </Button>
      <Button sx={{ marginTop: ".5rem" }} variant="outlined" onClick={onCancel}>
        Abbrechen und zurück
      </Button>
    </Paper>
  );
}

