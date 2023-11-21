import { SxProps, useAutocomplete } from "@mui/material";
import { Box } from "@mui/system";
import { User } from "@prisma/client";

type UsersElementProps = {
  users: User[];
  sx?: SxProps;
};

export default function UsersElement({ users, sx }: UsersElementProps) {
  //https://mui.com/material-ui/react-autocomplete/
  const {} = useAutocomplete({
    options: users,
    getOptionLabel: (u) => u.name || u.email,
  });

  return <Box sx={sx}>{users?.map((u) => u.name || u.email)}</Box>;
}
