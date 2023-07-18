import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { prisma } from "@/db/prisma";
import { Role } from "@prisma/client";

const FAKE_PASSWORD = "asokdA87fnf30efjoiOI**cwjkn";

export interface ICreateUser {
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "EMAIL_ALREADY_EXISTS_ERROR"
    | "UNKNON_USER_ID_ERROR";
}

export default async function createUser(req: SessionRequest, res: any) {
  await superTokensNextWrapper(
    async (next) => {
      await verifySession({
        overrideGlobalClaimValidators: async function (globalClaimValidators) {
          return [
            ...globalClaimValidators,
            UserRoles.UserRoleClaim.validators.includes("admin"),
          ];
        },
      })(req, res, next);
    },
    req,
    res
  );

  let email = req.body.email;

  let signUpResult = await EmailPassword.signUp(email, FAKE_PASSWORD).catch(
    (err) => console.log(err)
  );
  if (!signUpResult)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  if (signUpResult.status === "EMAIL_ALREADY_EXISTS_ERROR") {
    res.status(400).json({ error: "EMAIL_ALREADY_EXISTS_ERROR" });
    return;
  }

  prisma.user
    .create({
      data: {
        authId: signUpResult.user.id,
        email: signUpResult.user.email,
        role: Role.USER,
      },
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    });

  // we successfully created the user. Now we should send them their invite link
  let passwordResetToken = await EmailPassword.createResetPasswordToken(
    signUpResult.user.id
  );

  if (passwordResetToken.status === "UNKNOWN_USER_ID_ERROR") {
    console.error("error: " + passwordResetToken.status);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  let inviteLink =
    "http://localhost:3000/auth/reset-password?token=" +
    passwordResetToken.token;
  await EmailPassword.sendEmail({
    //@ts-ignore - this is a custom type
    type: "INVITE_EMAIL",
    passwordResetLink: inviteLink,
    user: {
      email: signUpResult.user.email,
      id: signUpResult.user.id,
    },
  });
  res.status(200);
}
