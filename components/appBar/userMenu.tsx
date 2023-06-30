import { Edit, Logout } from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { User } from "@prisma/client";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export interface UserMenuComponentProps {
  user: User | undefined;
  open: boolean;
  anchorEl: Element | undefined | null;
  onClose: () => void;
}

export default function UserMenuComponent({
  user,
  open,
  anchorEl,
  onClose,
}: UserMenuComponentProps) {
  async function handleLogout() {
    await signOut();
    window.location.href = "/";
    onClose();
  }

  function handleMeClick() {
    onClose();
    window.location.href = "/me";
  }

  return (
    <Menu open={open} onClose={onClose} anchorEl={anchorEl}>
      <Box sx={{ m: ".5rem" }}>
        <MenuItem onClick={handleMeClick}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <Tooltip title="Benutzerdaten bearbeiten">
            <>
              {user && <Typography>{user.name || user.email}</Typography>}
              {!user && <LinearProgress />}
            </>
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Abmelden</ListItemText>
        </MenuItem>
      </Box>
    </Menu>
  );
}
