import { MenuItem, Select } from "@mui/material";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

export interface RoleSelectProps {
  isAdmin: boolean;
  value?: Role;
  onChange: (value: Role) => void;
}

const RoleSelect = ({ isAdmin, onChange, value }: RoleSelectProps) => {
  const [role, setRole] = useState<Role>(value || Role.USER);

  useEffect(() => setRole(value), [value]);

  return (
    <Select
      value={role}
      onChange={(e) => {
        setRole(e.target.value as Role);
        onChange(e.target.value as Role);
      }}
    >
      <MenuItem value={Role.ADMIN} disabled={!isAdmin}>
        Admin
      </MenuItem>
      <MenuItem value={Role.CONTROLLER} disabled={!isAdmin}>
        Controller
      </MenuItem>
      <MenuItem value={Role.ORGCONTROLLER}>Org Controller</MenuItem>
      <MenuItem value={Role.USER}>User</MenuItem>
    </Select>
  );
};
export default RoleSelect;
