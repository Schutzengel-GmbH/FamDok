import { GetContentResult } from "supertokens-node/lib/build/ingredients/emaildelivery/services/smtp";

export function getEmail(
  type: "PASSWORD_RESET" | "INVITE_EMAIL",
  passwordResetLink: string,
  email: string
): GetContentResult {
  switch (type) {
    case "PASSWORD_RESET":
      return {
        subject: `Passwort zurücksetzen für ${
          process.env.NEXT_PUBLIC_APP_NAME || process.env.NEXT_PUBLIC_APP_URL
        }`,
        body: resetMailBody(passwordResetLink),
        isHtml: true,
        toEmail: email,
      };
    case "INVITE_EMAIL":
      return {
        subject: `Ihr Zugang zu ${
          process.env.NEXT_PUBLIC_APP_NAME || process.env.NEXT_PUBLIC_APP_URL
        }`,
        body: inviteMailBody(passwordResetLink),
        isHtml: true,
        toEmail: email,
      };
  }
}

const style = `
html,
body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
        Helvetica Neue, sans-serif;
}

a {
    color: inherit;
    text-decoration: none;
}

* {
    box-sizing: border-box;
}
`;

function resetMailBody(passwordResetLink: string) {
  return `
    <style>
      ${style}
    </style>
  
    <body>
      <h1>Sie haben ein neues Passworts angefordert</h2>
      <p>Klicken Sie einfach auf diesen <a href="${passwordResetLink}">Link</a>, um das Passwort zurückzusetzen.</p>
      <p>Falls Sie diese E-Mail nicht angefordert haben, müssen Sie nichts weiter unternehmen.</p>
      <p>Falls der Link oben nicht funktioniert, kopieren Sie den folgenden Link in einen Browser:</p>
      <code>${passwordResetLink}</code>

    </body>
  `;
}

function inviteMailBody(passwordResetLink: string) {
  return `
    <style>
      ${style}
    </style>
  
    <body>
      <h1>Sie wurden zu ${
        process.env.NEXT_PUBLIC_APP_NAME || process.env.NEXT_PUBLIC_APP_URL
      } eingeladen</h2>
      <p>Klicken Sie einfach auf diesen <a href="${passwordResetLink}">Link</a>. 
        Sie werden dann aufgefordert ein Passwort für die Anmeldung zu vergeben. 
        Sie melden sich dann mit dieser E-Mail-Adresse und ihrem Passwort an.</p>
      <p>Falls Sie diese E-Mail nicht angefordert haben, müssen Sie nichts weiter unternehmen.</p>
      <p>Falls der Link oben nicht funktioniert, kopieren Sie den folgenden Link in einen Browser:</p>
      <code>${passwordResetLink}</code>

    </body>
  `;
}
