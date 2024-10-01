import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { logger as _logger } from "@/config/logger";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { getUserByEmail } from "@/utils/authUtils";

export interface IRequestPassword {}

export default async function requestPassword(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/request-password`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
  });

  logger.info("accessed endpoint");

  res.status(200).json({
    message:
      "Reset Mail will be sent if the mail address exists in the system.",
  });

  const { email } = req.body as { email: string };

  const user = await getUserByEmail(email);

  let passwordResetToken = await EmailPassword.createResetPasswordToken(
    "public",
    user.id,
    email
  );

  if (!user) {
    logger.warn(`tried to reset password for non-existant email ${email}`);
    return;
  }

  if (passwordResetToken.status === "UNKNOWN_USER_ID_ERROR") {
    logger.error("error: " + passwordResetToken.status);
    return;
  }

  let inviteLink = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/auth/reset-password?token=${passwordResetToken.token}`;

  await EmailPassword.sendEmail({
    type: "PASSWORD_RESET",
    passwordResetLink: inviteLink,
    user: {
      id: user.id,
      recipeUserId: user.loginMethods.find(
        (r) => r.recipeId === "emailpassword"
      ).recipeUserId,
      email: user.emails[0],
    },
    tenantId: "public",
  });

  return;
}

