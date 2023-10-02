import { prisma } from "@/db/prisma";
import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { logger as _logger } from "@/config/logger";
import { Response } from "express";
import EmailPassword from "supertokens-node/recipe/emailpassword";

export interface IPasswordResetLink {
  link?: string;
  error?: "FORBIDDEN" | "USER_NOT_FOUND";
}

export default async function users(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/auth/passwordResetLink`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
  });
  logger.info("accessed endpoint");

  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  const reqUser = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!reqUser || reqUser.role !== Role.ADMIN)
    return res.status(403).json({ error: "FORBIDDEN" });

  const { email } = req.body as { email: string };

  const user = await EmailPassword.getUserByEmail(email);

  let passwordResetToken = await EmailPassword.createResetPasswordToken(
    user.id
  );

  if (passwordResetToken.status === "UNKNOWN_USER_ID_ERROR") {
    logger.error("error: " + passwordResetToken.status);
    return res.status(403).json({ error: "USER_NOT_FOUND" });
  }

  let link = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/auth/reset-password?token=${passwordResetToken.token}`;

  return res.status(200).json({ link });
}
