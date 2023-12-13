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
import { ThemeProvider, createTheme } from "@mui/material";
import { DataGrid, deDE } from "@mui/x-data-grid";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { deDE as coreDeDE } from "@mui/material/locale";
import { ConfigProvider } from "@/components/utilityComponents/conficContext";

if (typeof window !== "undefined") {
  SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

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

  const theme = createTheme({}, deDE, pickersDeDE, coreDeDE);

  return (
    <SuperTokensWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ThemeProvider theme={theme}>
          <ConfigProvider>
            <Layout>
              <InfoDialogProvider>
                <ToastProvider>
                  <Component {...pageProps} />
                </ToastProvider>
              </InfoDialogProvider>
            </Layout>
          </ConfigProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </SuperTokensWrapper>
  );
}

export default MyApp;
