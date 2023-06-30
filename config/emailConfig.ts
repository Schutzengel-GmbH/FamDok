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
              //@ts-ignore - this is a custom type
              if (type !== "INVITE_EMAIL") {
                return originalImplementation.getContent(input);
              }

              // you can even call the original implementation and modify that
              let originalContent = await originalImplementation.getContent(
                input
              );
              originalContent.subject = "Konto aktivieren";
              originalContent.body = `Hallo ${user.email},
Klicken zum aktivieren: ${passwordResetLink}
              `;
              return originalContent;
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
