import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { isValidEmail } from "../../utils/validationUtils";
import { useUserData } from "../../utils/authUtils";
import Loading from "../utilityComponents/loadingMainContent";
import { useState } from "react";
import useNotification from "../utilityComponents/notificationContext";

export default function EditMe() {
  const { user, isLoading, error } = useUserData();
  if (isLoading) return <Loading />;

  const { addAlert } = useNotification();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

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
    const response = await fetch("/api/user/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok)
      addAlert({ message: "Änderungen gespeichert", severity: "success" });
    else addAlert({ message: "Fehler beim Speichern", severity: "error" });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "& > *": { mt: "1rem" },
      }}
    >
      <Typography variant="h4">Meine Daten bearbeiten</Typography>

      <TextField value={name} onChange={handleNameChange} label={"Name"} />

      <TextField
        value={email}
        onChange={handleEmailChange}
        label={"E-Mail"}
        error={!emailValid}
      />

      <Button onClick={handleSave} disabled={!emailValid}>
        Speichern
      </Button>
    </Box>
  );
}
