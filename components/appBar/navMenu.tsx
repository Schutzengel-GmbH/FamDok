import { Home } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Role } from "@prisma/client";
import { NextRouter } from "next/router";

export interface NavMenuComponentProps {
  role: Role | undefined;
  router: NextRouter;
  onClose: () => void;
}

export default function NavMenuComponent({
  role,
  router,
  onClose,
}: NavMenuComponentProps) {
  function onNavClick(url: string) {
    router.push(url);
    onClose();
  }

  function canAccessAdminDashboard() {
    return role !== undefined && role !== Role.USER;
  }

  return (
    <List sx={{ width: 240 }}>
      <ListItemButton onClick={() => onNavClick("/")}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary={"Hauptseite"} />
      </ListItemButton>

      {canAccessAdminDashboard() && (
        <ListItemButton onClick={() => onNavClick("/adminDashboard")}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={"Admin-Dashboard"} />
        </ListItemButton>
      )}
    </List>
  );
}
