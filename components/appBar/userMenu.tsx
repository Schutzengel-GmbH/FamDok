import { Edit, Logout } from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  LinearProgress,
  Divider,
} from "@mui/material";
import { Box } from "@mui/system";
import { NextRouter } from "next/router";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import { useUserData } from "@/utils/authUtils";
import { APP_VER } from "@/config/const";

type UserMenuComponentProps = {
  router: NextRouter;
  open: boolean;
  anchorEl: Element | undefined | null;
  onClose: () => void;
};

export default function UserMenuComponent({
  router,
  open,
  anchorEl,
  onClose,
}: UserMenuComponentProps) {
  const { user } = useUserData();

  async function handleLogout() {
    await signOut();
    router.push("/auth");
    onClose();
  }

  function handleMeClick() {
    onClose();
    router.push("/me");
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
        <Divider />
        {process.env.NEXT_PUBLIC_VER && (
          <Typography sx={{ textAlign: "right", fontSize: "small" }}>
            v{APP_VER}
          </Typography>
        )}
      </Box>
    </Menu>
  );
}
