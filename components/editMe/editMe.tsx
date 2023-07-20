import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { isValidEmail } from "@/utils/validationUtils";
import { useUserData } from "@/utils/authUtils";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { useEffect, useState } from "react";
import useNotification from "@/components/utilityComponents/notificationContext";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IUserMe } from "@/pages/api/user/me";

export default function EditMe() {
  const { user, isLoading, error, mutate } = useUserData();

  const { addAlert } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <Alert severity="error">
        Fehler beim Abrufen der Nutzerdaten: {error}
      </Alert>
    );

  const emailValid = isValidEmail(email);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  async function handleSave() {
    const res = await apiPostJson<IUserMe>("/api/user/me", { name, email });
    if (res instanceof FetchError)
      addAlert({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addAlert({ message: "Fehler beim Speichern", severity: "error" });
      else addAlert({ message: "Änderungen gespeichert", severity: "success" });
      mutate();
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h4">Meine Daten bearbeiten</Typography>

      <TextField value={name} onChange={handleNameChange} label={"Name"} />

      <TextField
        value={email}
        onChange={handleEmailChange}
        label={"E-Mail"}
        error={!emailValid}
        helperText={!emailValid && "Bitte eine gültige E-Mail-Adresse eingeben"}
      />

      <Button onClick={handleSave} disabled={!emailValid}>
        Speichern
      </Button>
    </Box>
  );
}
