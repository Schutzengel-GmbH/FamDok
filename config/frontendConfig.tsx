import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import Router from "next/router";

export let frontendConfig = () => {
  return {
    languageTranslations: {
      translations: {
        de: {
          EMAIL_PASSWORD_EMAIL_LABEL: "E-Mail",
          EMAIL_PASSWORD_EMAIL_PLACEHOLDER: "E-Mail-Adresse",

          EMAIL_PASSWORD_PASSWORD_LABEL: "Passwort",
          EMAIL_PASSWORD_PASSWORD_PLACEHOLDER: "Passwort",

          EMAIL_PASSWORD_SIGN_IN_HEADER_TITLE: "Anmelden",
          EMAIL_PASSWORD_SIGN_IN_FOOTER_FORGOT_PW_LINK: "Passwort vergessen?",
          EMAIL_PASSWORD_SIGN_IN_SUBMIT_BTN: "ANMELDEN",
          EMAIL_PASSWORD_SIGN_IN_WRONG_CREDENTIALS_ERROR:
            "Passwort oder E-Mail ungültig",

          EMAIL_PASSWORD_SIGN_UP_HEADER_TITLE: "Sign Up",
          EMAIL_PASSWORD_SIGN_UP_HEADER_SUBTITLE_START:
            "Already have an account?",
          EMAIL_PASSWORD_SIGN_UP_HEADER_SUBTITLE_SIGN_IN_LINK: "Anmelden",

          EMAIL_PASSWORD_RESET_HEADER_TITLE: "Passwort zurücksetzen",
          EMAIL_PASSWORD_RESET_HEADER_SUBTITLE:
            "Eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts wird Ihnen zugeschickt",
          EMAIL_PASSWORD_RESET_SEND_FALLBACK_EMAIL: "Ihr Account",
          EMAIL_PASSWORD_RESET_SEND_BEFORE_EMAIL:
            "Eine E-Mail mit Anweisungen wurde an ",
          EMAIL_PASSWORD_RESET_SEND_AFTER_EMAIL:
            "verschickt, wenn die Adresse in unserem System bekannt ist. ",
          EMAIL_PASSWORD_RESET_RESEND_LINK: "Nochmal senden oder andere E-Mail",
          EMAIL_PASSWORD_RESET_SEND_BTN: "Abschicken",
          EMAIL_PASSWORD_RESET_SIGN_IN_LINK: "Anmelden",

          EMAIL_PASSWORD_RESET_SUBMIT_PW_SUCCESS_HEADER_TITLE: "Erfolg!",
          EMAIL_PASSWORD_RESET_SUBMIT_PW_SUCCESS_DESC:
            "Ihr Passwort wurde erfolgreich geändert",
          EMAIL_PASSWORD_RESET_SUBMIT_PW_SUCCESS_SIGN_IN_BTN: "ANMELDEN",

          EMAIL_PASSWORD_NEW_PASSWORD_LABEL: "Neues Passwort",
          EMAIL_PASSWORD_NEW_PASSWORD_PLACEHOLDER: "Neues Passwort",
          EMAIL_PASSWORD_CONFIRM_PASSWORD_LABEL: "Passwort bestätigen",
          EMAIL_PASSWORD_CONFIRM_PASSWORD_PLACEHOLDER: "Passwort bestätigen",

          EMAIL_PASSWORD_RESET_SUBMIT_PW_HEADER_TITLE: "Passwort ändern",
          EMAIL_PASSWORD_RESET_SUBMIT_PW_HEADER_SUBTITLE:
            "Neues Passwort eingeben",
          EMAIL_PASSWORD_RESET_SUBMIT_PW_CHANGE_PW_BTN: "PASSWORT ÄNDERN",
          EMAIL_PASSWORD_RESET_PASSWORD_INVALID_TOKEN_ERROR:
            "Password-Reset-Token ungültig",

          ERROR_EMAIL_NON_STRING: "E-Mail muss ein String sein",
          ERROR_EMAIL_INVALID: "E-Mail ungültig",

          ERROR_PASSWORD_NON_STRING: "Passwort muss ein String sein",
          ERROR_PASSWORD_TOO_SHORT:
            "Passwort muss mindestens 8 Zeichen und mindestens eine Ziffer enthalten",
          ERROR_PASSWORD_TOO_LONG: "Passwort muss kürzer als 100 Zeichen sein",
          ERROR_PASSWORD_NO_ALPHA:
            "Passwort muss mindestens einen Buchstaben enthalten",
          ERROR_PASSWORD_NO_NUM:
            "Passwort muss mindestens eine Ziffer enthalten",
          ERROR_CONFIRM_PASSWORD_NO_MATCH: "Passwörter stimmen nicht überein",

          ERROR_NON_OPTIONAL: "Angabe ist nicht optional",

          BRANDING_POWERED_BY_START: "Powered by ",
          BRANDING_POWERED_BY_END: "",
          SOMETHING_WENT_WRONG_ERROR:
            "Da ist etwas unerwartet schiefgelaufen. Bitte noch einmal versuchen.",

          /*
           * The following are error messages from our backend SDK.
           * These are returned as full messages to preserver compatibilty, but they work just like the keys above.
           * They are shown as is by default (setting the value to undefined will display the raw translation key)
           */
          "This email already exists. Please sign in instead.": undefined,
          "Field is not optional": undefined,
          "Password must contain at least 8 characters, including a number":
            undefined,
          "Password's length must be lesser than 100 characters": undefined,
          "Password must contain at least one alphabet": undefined,
          "Password must contain at least one number": undefined,
          "Email is invalid": undefined,
        },
      },
      defaultLanguage: "de",
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      EmailPasswordReact.init({
        style: `
                [data-supertokens~=headerSubtitle] {
                    display: none;
                }

                [data-supertokens~=container] {
                  --palette-primary: 25,118,210;
                  --palette-primaryBorder: 66,165,245;
                }

                [data-supertokens~=superTokensBranding] {
                  display: none;
                }
            `,
      }),
      SessionReact.init(),
    ],
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};

