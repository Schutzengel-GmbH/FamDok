import { FullUser } from "@/types/prismaHelperTypes";
import { useUsers } from "@/utils/apiHooks";
import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";

type UsersElementProps = {
  users: FullUser[];
  organizationId;
  onChange: (selectedUsers: FullUser[]) => void;
  sx?: SxProps;
};

export default function UsersElement({
  users,
  organizationId,
  sx,
  onChange,
}: UsersElementProps) {
  const { users: availableUsers, isLoading } = useUsers(
    `?organizationId=${organizationId}`
  );

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={sx}>
      <Autocomplete
        multiple
        renderInput={(params) => (
          <TextField {...params} label="Zugeordnete Fachkräfte" />
        )}
        options={availableUsers || []}
        getOptionLabel={(u) => u.name || u.email}
        onChange={(e, selectedUsers) => onChange(selectedUsers)}
        value={users || []}
        isOptionEqualToValue={(o, v) => o.id === v.id}
      />
    </Box>
  );
}

