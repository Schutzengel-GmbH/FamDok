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
import Session from "supertokens-web-js/recipe/session";
import { useRouter } from "next/router";
import NavMenuComponent from "@/components/appBar/navMenu";
import { useConfig } from "../utilityComponents/conficContext";

export default function MainAppBar() {
  const theme = useTheme();
  const settings = useConfig();

  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<
    HTMLElement | undefined
  >(undefined);
  const openUserMenu = Boolean(userMenuAnchorEl);

  const [navMenuOpen, setNavMenuOpen] = React.useState(false);
  const router = useRouter();

  async function handleUserMenu(e: React.MouseEvent<HTMLButtonElement>) {
    if (!(await Session.doesSessionExist())) {
      router.push("/auth");
    } else {
      setUserMenuAnchorEl(e.currentTarget);
    }
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(undefined);
  }

  async function handleNavMenu() {
    if (!(await Session.doesSessionExist())) {
      return;
    } else {
      setNavMenuOpen(true);
    }
  }

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
