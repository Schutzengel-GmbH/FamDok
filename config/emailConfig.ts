import { getEmail } from "@/config/emails";
import { TypeInput } from "supertokens-node/lib/build/recipe/emailpassword/types";
import { SMTPService } from "supertokens-node/recipe/emailpassword/emaildelivery";

let smtpSettings = {
  host: process.env.SMTP_HOST,
  authName: process.env.SMTP_AUTH_NAME,
  password: process.env.SMTP_PASSWORD,
  port: parseInt(process.env.SMTP_PORT),
  from: {
    name: process.env.SMTP_FROM_NAME,
    email: process.env.SMTP_FROM_EMAIL,
  },
  secure: false,
};

export let emailConfig = (): TypeInput => {
  return {
    emailDelivery: {
      service: new SMTPService({
        smtpSettings,
        override: (originalImplementation) => {
          return {
            ...originalImplementation,
            getContent: async function (input) {
              let { passwordResetLink, user, type, userContext } = input;

              return getEmail(type, passwordResetLink, user.email);
            },
          };
        },
      }),
    },
    override: {
      apis: (originalImplementation) => {
        return {
          ...originalImplementation,
          signUpPOST: undefined,
        };
      },
    },
  };
};
