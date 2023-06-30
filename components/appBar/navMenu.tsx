import { Home } from "@mui/icons-material";
import { Icon, List, ListItemButton, ListItemText } from "@mui/material";
import { NextRouter } from "next/router";

export interface NavMenuComponentProps {
  router: NextRouter;
  onClose: () => void;
}

export default function NavMenuComponent({
  router,
  onClose,
}: NavMenuComponentProps) {
  return (
    <List>
      <ListItemButton
        onClick={() => {
          router.push("/");
          onClose();
        }}
      >
        <ListItemText>
          <Home /> Hauptseite
        </ListItemText>
      </ListItemButton>
    </List>
  );
}
