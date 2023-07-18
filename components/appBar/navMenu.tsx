import { Home } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Role } from "@prisma/client";
import { NextRouter } from "next/router";
import { useUserData } from "../../utils/authUtils";
import { navigationList } from "../../utils/navigationUtils";

export interface NavMenuComponentProps {
  router: NextRouter;
  onClose: () => void;
}

export default function NavMenuComponent({
  router,
  onClose,
}: NavMenuComponentProps) {
  const { user } = useUserData();

  function onNavClick(url: string) {
    router.push(url);
    onClose();
  }

  return (
    <List sx={{ width: 240 }}>
      <ListItemButton onClick={() => onNavClick("/")}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary={"Hauptseite"} />
      </ListItemButton>

      {navigationList.map((navItem, i) => (
        <ListItemButton
          onClick={() => onNavClick(navItem.url)}
          sx={{ display: navItem.canAccess(user) ? undefined : "none" }}
          key={i}
        >
          <ListItemIcon>{navItem.icon}</ListItemIcon>
          <ListItemText primary={navItem.title} />
        </ListItemButton>
      ))}
    </List>
  );
}
