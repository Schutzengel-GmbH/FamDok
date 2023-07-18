import { Alert, Button, Paper } from "@mui/material";

type UnsavedChangesComponentProps = {
  unsavedChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function UnsavedChangesComponent({
  unsavedChanges,
  onSave,
  onCancel,
}: UnsavedChangesComponentProps) {
  return (
    <Paper
      sx={
        unsavedChanges
          ? {
              position: "sticky",
              top: ".5rem",
              zIndex: "100",
              p: ".5rem",
              minWidth: "80%",
            }
          : { display: "none" }
      }
      elevation={3}
    >
      <Alert severity={"warning"}>
        Es liegen noch nicht gespeicherte Änderungen vor!
      </Alert>
      <Button
        sx={{ marginTop: ".5rem", mr: ".5rem" }}
        variant="outlined"
        onClick={onSave}
      >
        Speichern
      </Button>
      <Button sx={{ marginTop: ".5rem" }} variant="outlined" onClick={onCancel}>
        Abbrechen und zurück
      </Button>
    </Paper>
  );
}
