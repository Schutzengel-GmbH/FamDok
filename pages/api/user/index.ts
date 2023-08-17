import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { Prisma, Role } from "@prisma/client";
import { getUserWhereInput } from "@/utils/backendUtils";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

const FAKE_PASSWORD = "asokdA87fnf30efjoiOI**cwjkn";
export interface IUsers {
  user?: Prisma.UserGetPayload<{ include: { organization: true } }>;
  users?: Prisma.UserGetPayload<{ include: { organization: true } }>[];
  error?:
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "FORBIDDEN";
}

export default async function users(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/user`,
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

  const where = getUserWhereInput(req.query);

  const reqUser = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!reqUser || reqUser.role === Role.USER)
    return res.status(403).json({ error: "FORBIDDEN" });

  // if user is org controller, only allow access to users in their org
  let organizationId = undefined;
  if (reqUser.role === Role.ORGCONTROLLER)
    organizationId = reqUser.organizationId;

  switch (req.method) {
    case "GET":
      const users = await prisma.user
        .findMany({
          where: {
            ...where,
            organizationId: organizationId ?? where.organizationId,
          },
          include: { organization: true },
        })
        .catch((err) => logger.error(err));

      if (!users)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ users });

    case "POST":
      let signUpResult = await EmailPassword.signUp(
        req.body.email,
        FAKE_PASSWORD
      ).catch((err) => logger.error(err));

      if (!signUpResult)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      if (signUpResult.status === "EMAIL_ALREADY_EXISTS_ERROR")
        return res.status(400).json({ error: "EMAIL_ALREADY_EXISTS_ERROR" });

      logger.info(req.body, "body");

      const newUser = await prisma.user
        .create({
          data: {
            ...req.body,
            authId: signUpResult.user.id,
            organizationId: organizationId ?? req.body.organizationId,
          },
          include: { organization: true },
        })
        .catch((err) => logger.error(err));

      if (!newUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      // we successfully created the user. Now we should send them their invite link
      let passwordResetToken = await EmailPassword.createResetPasswordToken(
        signUpResult.user.id
      );

      if (passwordResetToken.status === "UNKNOWN_USER_ID_ERROR") {
        logger.error("error: " + passwordResetToken.status);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      let inviteLink = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/set-password?token=${passwordResetToken.token}`;

      await EmailPassword.sendEmail({
        //@ts-ignore - this is a custom type
        type: "INVITE_EMAIL",
        passwordResetLink: inviteLink,
        user: {
          email: signUpResult.user.email,
          id: signUpResult.user.id,
        },
      });

      return res.status(200).json({ user: newUser });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
