import { MenuItem, Select } from "@mui/material";
import { Role } from "@prisma/client";
import { useState } from "react";

export interface RoleSelectProps {
  isAdmin: boolean;
  value?: Role;
  onChange: (value: Role) => void;
}

const RoleSelect = ({ isAdmin, onChange, value }: RoleSelectProps) => {
  const [role, setRole] = useState<Role>(value || Role.USER);

  return (
    <Select
      value={role}
      onChange={(e) => {
        setRole(e.target.value as Role);
        onChange(e.target.value as Role);
      }}
    >
      {isAdmin && <MenuItem value={Role.ADMIN}>Admin</MenuItem>}
      {isAdmin && <MenuItem value={Role.CONTROLLER}>Controller</MenuItem>}
      <MenuItem value={Role.ORGCONTROLLER}>Org Controller</MenuItem>
      <MenuItem value={Role.USER}>User</MenuItem>
    </Select>
  );
};
export default RoleSelect;
