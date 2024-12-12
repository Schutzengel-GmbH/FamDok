import SelectUser from "@/components/masterData/selectUser";
import useToast from "@/components/notifications/notificationContext";
import { updateMasterDataCreatedBy } from "@/utils/masterDataUtils";
import { Cancel, Save } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { MasterData, User } from "@prisma/client";
import { useEffect, useState } from "react";

interface CreatedByComponentProps {
  masterData: MasterData;
  user: User;
  canEdit: boolean;
  onChange: () => void;
}

export default function CreatedByComponent({
  masterData,
  canEdit,
  user,
  onChange,
}: CreatedByComponentProps) {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const userChanged = currentUser?.id !== user?.id;
  const { addToast } = useToast();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleChange = (user: User) => {
    setCurrentUser(user);
  };

  const handleSave = async () => {
    try {
      const res = await updateMasterDataCreatedBy(
        masterData.masterDataTypeId,
        masterData.number,
        currentUser
      );
      if (res.error)
        addToast({
          message: `Fehler beim Speichern eines Users: ${res.error}`,
          severity: "error",
        });
      else
        addToast({
          message: "Verantwortlicher User geändert",
          severity: "success",
        });
    } catch (error) {
      addToast({
        message: `Fehler beim Speichern eines Users: ${error}`,
        severity: "error",
      });
    }
    onChange();
  };

  const handleCancel = () => {
    setCurrentUser(user);
    onChange();
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        alignItems: "baseline",
        p: ".5rem",
      }}
    >
      <Typography variant="h6">Verantwortlich</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {!canEdit && <Typography>{user?.name || user?.email}</Typography>}
          {canEdit && <SelectUser user={currentUser} onChange={handleChange} />}
        </Box>
        <Box>
          <Button disabled={!userChanged} onClick={handleSave}>
            <Save />
            Save
          </Button>
        </Box>
        {userChanged && (
          <Button onClick={handleCancel}>
            <Cancel />
            Zurücksetzen
          </Button>
        )}
      </Box>
    </Paper>
  );
}
