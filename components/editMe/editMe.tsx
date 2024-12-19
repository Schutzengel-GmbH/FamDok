import {
  Alert,
  Box,
  Button,
  Select,
  TextField,
  Typography,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useUserData } from "@/utils/authUtils";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { useEffect, useState, useContext } from "react";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IUserMe } from "@/pages/api/user/me";
import useToast from "@/components/notifications/notificationContext";
import { ColorModeContext } from "@/pages/_app";
import { Theme } from "@prisma/client";

export default function EditMe() {
  const { user, isLoading, error, mutate } = useUserData();

  const { addToast } = useToast();

  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <Alert severity="error">
        Fehler beim Abrufen der Nutzerdaten: {error}
      </Alert>
    );

  const unsavedChanges = user.name !== name;

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  async function handleSave() {
    const res = await apiPostJson<IUserMe>("/api/user/me", { name });
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({ message: "Fehler beim Speichern", severity: "error" });
      else addToast({ message: "Änderungen gespeichert", severity: "success" });
      mutate();
    }
  }

  const { setColorMode, mode } = useContext(ColorModeContext);

  function handleChangeTheme(e: SelectChangeEvent<typeof mode>) {
    setColorMode(e.target.value as Theme);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h4">Meine Einstellungen bearbeiten</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography>Farbschema: </Typography>
        <Select value={mode} onChange={handleChangeTheme}>
          <MenuItem value={Theme.System}>System</MenuItem>
          <MenuItem value={Theme.Light}>Hell</MenuItem>
          <MenuItem value={Theme.Dark}>Dunkel</MenuItem>
        </Select>
      </Box>

      <TextField value={name} onChange={handleNameChange} label={"Name"} />

      <Button onClick={handleSave} disabled={!unsavedChanges}>
        Speichern
      </Button>
    </Box>
  );
}

