import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import { appInfo } from "./appInfo";
import { AuthConfig } from "../interfaces";
import UserRoles from "supertokens-node/recipe/userroles";
import { emailConfig } from "./emailConfig";

export let backendConfig = (): AuthConfig => {
  return {
    framework: "express",
    supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
      apiKey: process.env.API_KEY,
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      EmailPasswordNode.init(emailConfig()),
      UserRoles.init(),
      SessionNode.init(),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};
