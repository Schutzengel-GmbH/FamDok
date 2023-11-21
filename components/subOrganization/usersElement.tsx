import { useUsers } from "@/utils/apiHooks";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Chip,
  CircularProgress,
  SxProps,
  TextField,
  useAutocomplete,
} from "@mui/material";
import { Box } from "@mui/system";
import { User } from "@prisma/client";
import { ReactNode, useMemo, useState } from "react";

type UsersElementProps = {
  users: User[];
  organizationId;
  onChange: (selectedUsers: User[]) => void;
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
        renderInput={(params) => <TextField {...params} label="Fachkräfte" />}
        options={availableUsers || []}
        getOptionLabel={(u) => u.name || u.email}
        onChange={(e, selectedUsers) => onChange(selectedUsers)}
        value={users || []}
        isOptionEqualToValue={(o, v) => o.id === v.id}
      />
    </Box>
  );
}

