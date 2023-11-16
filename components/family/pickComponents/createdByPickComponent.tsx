import ErrorPage from "@/components/utilityComponents/error";
import { useOrganizations, useUsers } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { User } from "@prisma/client";

type CreatedByPickComponentProps = {
  onChange: (user: User) => void;
  sx?: SxProps;
  value: User;
};

export default function CreatedByPickComponent({
  onChange,
  sx,
  value,
}: CreatedByPickComponentProps) {
  const { user: me } = useUserData();
  const { organizations } = useOrganizations();
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorPage />;

  const userString = (u: User) =>
    `${u.name || u.email}${
      me.organizationId
        ? ""
        : `: ${
            organizations.find((o) => o.id === u.organizationId)?.name ??
            "Keine Organisation"
          }`
    }`;

  function handleChange(e: SelectChangeEvent<string>) {
    const newUser = users.find((u) => u.id === e.target.value);
    onChange(newUser);
  }

  return (
    <Box sx={sx}>
      <Select
        value={value?.id}
        onChange={handleChange}
        label={"Verantwortlich"}
      >
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {userString(u)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
