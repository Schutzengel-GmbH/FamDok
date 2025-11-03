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
import { InputDialogProvider } from "@/components/inputDialog/inputDialogContext";
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
//import "react-tabulator/css/tabulator_midnight.css";
import "@/utils/tabulator.css";
import CookieBanner from "@/components/utilityComponents/cookieBanner";
import "@/public/fontawesome/css/fontawesome.css";
import "@/public/fontawesome/css/solid.css";
import { useUserData } from "@/utils/authUtils";
import { Theme } from "@prisma/client";
import { apiPostJson } from "@/utils/fetchApiUtils";
import { IUserMe } from "@/pages/api/user/me";

if (typeof window !== "undefined") {
  SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

export const ColorModeContext = React.createContext({
  setColorMode: (mode: Theme) => {},
  mode: "System" as Theme,
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

  const [mode, setMode] = React.useState<Theme>();

  const setColorMode = async (theme: Theme) => {
    const res = await apiPostJson<IUserMe, { theme: Theme }>("/api/user/me", {
      theme,
    });
    setMode(theme);
  };

  const { user } = useUserData();

  useEffect(() => {
    if (!user) setMode(Theme.System);
    else setMode(user.theme);
  }, [user]);

  const theme = React.useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode:
              mode === Theme.System
                ? systemPrefersDark
                  ? "dark"
                  : "light"
                : mode === Theme.Light
                ? "light"
                : "dark",
          },
        },
        deDE,
        pickersDeDE,
        coreDeDE
      ),
    [systemPrefersDark, mode]
  );

  return (
    <SuperTokensWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ColorModeContext.Provider value={{ setColorMode, mode }}>
          <ThemeProvider theme={theme}>
            <ConfigProvider>
              <CssBaseline />
              <Layout>
                <InputDialogProvider>
                  <InfoDialogProvider>
                    <ToastProvider>
                      <script
                        type="text/javascript"
                        src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"
                      ></script>
                      <Component {...pageProps} />
                      <CookieBanner />
                    </ToastProvider>
                  </InfoDialogProvider>
                </InputDialogProvider>
              </Layout>
            </ConfigProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </SuperTokensWrapper>
  );
}

export default MyApp;
