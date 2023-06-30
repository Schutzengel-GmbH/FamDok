import { AppBar, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import React from "react";
import UserMenuComponent from "./userMenu";
import Session, {
  SessionContextType,
} from "supertokens-auth-react/recipe/session";
import useSWR from "swr";
import { fetcher } from "../../utils/swrConfig";
import { IUserMe } from "../../pages/api/user/me";
import { SessionContextUpdate } from "supertokens-auth-react/lib/build/recipe/session/types";
import router, { useRouter } from "next/router";
import session from "supertokens-node/recipe/session";
import { set } from "date-fns";
import NavMenuComponent from "./navMenu";

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
    setUserMenuAnchorEl(e.currentTarget);
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(undefined);
  }

  const { data: userData, isLoading } = useSWR(
    sessionContext.doesSessionExist ? "/api/user/me" : null,
    fetcher<IUserMe>
  );

  function handleNavMenu() {
    if (!sessionContext.doesSessionExist) {
      return;
    } else {
      setNavMenuOpen(true);
    }
  }

  if (sessionContext.loading) return null;

  return (
    <AppBar position="sticky">
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
            sessionContext.doesSessionExist
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>

      <UserMenuComponent
        router={router}
        user={userData?.user}
        onClose={handleCloseUserMenu}
        open={openUserMenu}
        anchorEl={userMenuAnchorEl}
      />

      <Drawer
        anchor="left"
        open={navMenuOpen}
        onClose={() => setNavMenuOpen(false)}
      >
        <NavMenuComponent
          router={router}
          onClose={() => setNavMenuOpen(false)}
        />
      </Drawer>
    </AppBar>
  );
}
