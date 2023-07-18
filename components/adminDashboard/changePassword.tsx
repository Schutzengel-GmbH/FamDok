import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { generateTempPassword } from "@/utils/authUtils";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function ChangePasswordDialog({
  open,
  onClose,
  userId,
}: ChangePasswordDialogProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [working, setWorking] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  function generate() {
    return generateTempPassword();
  }

  function cleanUp() {
    setError(undefined);
    setWorking(false);
    setPassword("");
  }

  async function handleChangePassword() {
    setWorking(true);
    setError("not implemented");
    setWorking(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        cleanUp();
        onClose();
      }}
      sx={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}
    >
      <DialogTitle>Passwort Ändern</DialogTitle>
      <DialogContent>
        {error && (
          <Alert sx={{ mt: ".5rem" }} variant="filled" severity="error">
            <strong>Fehler:</strong> {error}
          </Alert>
        )}
        <TextField
          sx={{ mt: ".5rem" }}
          type={"text"}
          label={"Passwort"}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            setPassword(generate());
          }}
        >
          Generieren
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleChangePassword}>
          {working ? <CircularProgress /> : "Ändern"}
        </Button>
        <Button
          onClick={() => {
            onClose();
            cleanUp();
          }}
        >
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
