import { useUsers } from "@/utils/apiHooks";
import { Autocomplete, Box, SxProps, TextField } from "@mui/material";
import { User } from "@prisma/client";
import { useState } from "react";

type UserSelectIdProps = {
  userId: string;
  onChange: (userId: string) => void;
  sx?: SxProps;
};

export default function UserSelectId({
  userId,
  onChange,
  sx,
}: UserSelectIdProps) {
  const [selectedUser, setSelectedUser] = useState<User>();
  const { users } = useUsers();

  return (
    <Box sx={sx}>
      <Autocomplete
        renderInput={(params) => <TextField {...params} label="Erstellt von" />}
        options={users || []}
        getOptionLabel={(u) => u.name || u.email}
        onChange={(e, user) => {
          onChange(user?.id);
          setSelectedUser(user);
        }}
        value={selectedUser}
        isOptionEqualToValue={(o, v) => o.id === v.id}
      />
    </Box>
  );
}

