import {
  AppBar,
  IconButton,
  Paper,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import React from "react";
import UserMenuComponent from "@/components/appBar/userMenu";
import Session, {
  SessionContextType,
} from "supertokens-auth-react/recipe/session";
import { SessionContextUpdate } from "supertokens-auth-react/lib/build/recipe/session/types";
import { useRouter } from "next/router";
import NavMenuComponent from "@/components/appBar/navMenu";
import { useConfig } from "../utilityComponents/conficContext";

export default function MainAppBar() {
  let sessionContext = Session.useSessionContext() as SessionContextType &
    SessionContextUpdate;

  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<
    HTMLElement | undefined
  >(undefined);
  const openUserMenu = Boolean(userMenuAnchorEl);

  const [navMenuOpen, setNavMenuOpen] = React.useState(false);
  const router = useRouter();

  function handleUserMenu(e: React.MouseEvent<HTMLButtonElement>) {
    if (!sessionContext.doesSessionExist) {
      router.push("/auth");
    } else {
      setUserMenuAnchorEl(e.currentTarget);
    }
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(undefined);
  }

  function handleNavMenu() {
    if (!sessionContext.doesSessionExist) {
      return;
    } else {
      setNavMenuOpen(true);
    }
  }

  if (sessionContext.loading) return null;

  const theme = useTheme();
  const settings = useConfig();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton color="inherit" onClick={handleNavMenu}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>

        <IconButton size="large" color="inherit" onClick={handleUserMenu}>
          <AccountCircle />
        </IconButton>
      </Toolbar>

      <UserMenuComponent
        router={router}
        onClose={handleCloseUserMenu}
        open={openUserMenu}
        anchorEl={userMenuAnchorEl}
      />

      <SwipeableDrawer
        anchor="left"
        open={navMenuOpen}
        onClose={() => setNavMenuOpen(false)}
        onOpen={() => setNavMenuOpen(true)}
      >
        <NavMenuComponent
          router={router}
          onClose={() => setNavMenuOpen(false)}
        />
      </SwipeableDrawer>
      {settings?.maintenanceMessage && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: theme.palette.error.light,
          }}
          elevation={6}
        >
          {settings.maintenanceMessage}
        </Paper>
      )}
    </AppBar>
  );
}
