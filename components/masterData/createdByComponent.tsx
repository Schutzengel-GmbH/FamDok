import { useUsers } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { Cancel, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { User } from "@prisma/client";

interface CreatedByComponentProps {
  user: User;
  canEdit: boolean;
  userChanged: boolean;
  onChange: (user: User) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function CreatedByComponent({
  canEdit,
  user,
  userChanged,
  onChange,
  onCancel,
  onSave,
}: CreatedByComponentProps) {
  const { users } = useUsers();
  const { user: activeUser } = useUserData();
  const canEditUser = canEdit && activeUser?.role !== "USER";

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
          {!canEditUser && <Typography>{user?.name || user?.email}</Typography>}
          {canEditUser && (
            <Select
              value={user?.id || ""}
              onChange={(e) =>
                onChange(
                  users?.find((u) => u.id === (e.target.value as string))
                )
              }
            >
              {users?.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name || u.email}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        {canEditUser && (
          <Box>
            <Button disabled={!userChanged} onClick={onSave}>
              <Save />
              Save
            </Button>
          </Box>
        )}
        {canEditUser && userChanged && (
          <Button onClick={onCancel}>
            <Cancel />
            Zurücksetzen
          </Button>
        )}
      </Box>
    </Paper>
  );
}

