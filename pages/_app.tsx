import "../styles/globals.css";
import React from "react";
import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import * as SuperTokensConfig from "../config/frontendConfig";
import Session from "supertokens-auth-react/recipe/session";
import MainAppBar from "../components/appBar/mainAppBar";
import Layout from "../components/layout";
import { NotificationProvider } from "../components/utilityComponents/notificationContext";
import { UserContextProvider } from "../components/utilityComponents/userDataContext";

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

  return (
    <SuperTokensWrapper>
      <Layout>
        <UserContextProvider>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </UserContextProvider>
      </Layout>
    </SuperTokensWrapper>
  );
}

export default MyApp;
