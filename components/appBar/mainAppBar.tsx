import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import React from "react";
import UserMenuComponent from "./userMenu";
import Session from "supertokens-auth-react/recipe/session";
import useSWR from "swr";
import { fetcher } from "../../utils/swrConfig";
import { IUserMe } from "../../pages/api/user/me";

export default function MainAppBar() {
  let sessionContext = Session.useSessionContext();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<
    HTMLElement | undefined
  >(undefined);
  const openUserMenu = Boolean(userMenuAnchorEl);

  function handleUserMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setUserMenuAnchorEl(e.currentTarget);
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(undefined);
  }

  const { data: userData, isLoading } = useSWR(
    "/api/user/me",
    fetcher<IUserMe>
  );

  function handleNavMenu() {}

  if (sessionContext.loading) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={handleNavMenu}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dokumentation
        </Typography>
        <IconButton
          size="large"
          color="inherit"
          onClick={handleUserMenu}
          sx={
            //@ts-ignore
            sessionContext.doesSessionExist
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>

      <UserMenuComponent
        user={userData?.user}
        onClose={handleCloseUserMenu}
        open={openUserMenu}
        anchorEl={userMenuAnchorEl}
      />
    </AppBar>
  );
}
