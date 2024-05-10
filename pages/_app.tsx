import "../styles/globals.css";
import React from "react";
import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import * as SuperTokensConfig from "../config/frontendConfig";
import Session from "supertokens-auth-react/recipe/session";
import Layout from "../components/layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale";
import { ToastProvider } from "@/components/notifications/notificationContext";
import { InfoDialogProvider } from "@/components/infoDialog/infoDialogContext";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { deDE } from "@mui/x-data-grid";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { deDE as coreDeDE } from "@mui/material/locale";
import { ConfigProvider } from "@/components/utilityComponents/conficContext";
import CookieBanner from "@/components/utilityComponents/cookieBanner";

if (typeof window !== "undefined") {
  SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

export type ColorMode = "light" | "dark" | "system";
export const ColorModeContext = React.createContext({
  setColorMode: (mode: ColorMode) => {},
  mode: "system" as ColorMode,
});

function MyApp({ Component, pageProps }): JSX.Element {
  useEffect(() => {
    async function doRefresh() {
      if (pageProps.fromSupertokens === "needs-refresh") {
        if (await Session.attemptRefreshingSession()) {
          location.reload();
        } else {
          // user has been logged out
          SuperTokensReact.redirectToAuth();
        }
      }
    }
    doRefresh();
  }, [pageProps.fromSupertokens]);
  if (pageProps.fromSupertokens === "needs-refresh") {
    return null;
  }

  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = React.useState<ColorMode>();

  const setColorMode = (mode: ColorMode) => {
    setMode(mode);
    localStorage.setItem("colorMode", mode);
  };

  useEffect(() => {
    let savedMode = localStorage.getItem("colorMode");
    if (!savedMode) setMode("system");
    else if (savedMode !== mode) setMode(savedMode as ColorMode);
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode:
              mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode,
          },
        },
        deDE,
        pickersDeDE,
        coreDeDE,
      ),
    [systemPrefersDark, mode],
  );

  return (
    <SuperTokensWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ColorModeContext.Provider value={{ setColorMode, mode }}>
          <ThemeProvider theme={theme}>
            <ConfigProvider>
              <CssBaseline />
              <Layout>
                <InfoDialogProvider>
                  <ToastProvider>
                    <Component {...pageProps} />
                    <CookieBanner />
                  </ToastProvider>
                </InfoDialogProvider>
              </Layout>
            </ConfigProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </SuperTokensWrapper>
  );
}

export default MyApp;
