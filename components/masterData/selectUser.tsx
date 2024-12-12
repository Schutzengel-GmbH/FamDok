import { useUsers } from "@/utils/apiHooks";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { User } from "@prisma/client";
import { useState } from "react";

interface SelectUserProps {
  user: User;
  onChange: (user: User) => void;
}

export default function SelectUser({ user, onChange }: SelectUserProps) {
  const { users, isLoading, error } = useUsers();

  const handleChange = (id: string) => {
    const newUser = users.find((u) => u.id === id);
    onChange(newUser);
  };

  return (
    <Select value={user?.id} onChange={(e) => handleChange(e.target.value)}>
      {isLoading && <CircularProgress />}
      {!isLoading &&
        users.map((u) => <MenuItem value={u.id}>{u.name || u.email}</MenuItem>)}
    </Select>
  );
}
