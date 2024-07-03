import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens, { deleteUser } from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { Prisma, Role, User } from "@prisma/client";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { isValidEmail } from "@/utils/validationUtils";
import { logger as _logger } from "@/config/logger";
import { FullUser } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface IUser {
  user?: FullUser;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "NOT_FOUND"
    | "FORBIDDEN"
    | "METHOD_NOT_ALLOWED"
    | "EMAIL_ALREADY_EXISTS_ERROR"
    | "UNKNOWN_USER_ID_ERROR"
    | "PASSWORD_POLICY_VIOLATED_ERROR"
    | "INVALID_EMAIL";
}

export default async function user(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/user/${req.query.id}`,
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
  const { id } = req.query;

  const reqUser = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!reqUser) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let user: User;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { id: id as string },
      include: { organization: true, subOrganizations: true },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "NOT_FOUND" });

    logger.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  // check user role if not just get
  if (req.method !== "GET") {
    if (!reqUser || reqUser.role === Role.USER)
      return res.status(403).json({ error: "FORBIDDEN" });

    if (
      (reqUser.role === Role.ORGCONTROLLER &&
        reqUser.organizationId !== user.organizationId) ||
      (reqUser.role === Role.CONTROLLER &&
        user.id !== reqUser.id &&
        (user.role === Role.CONTROLLER || user.role === Role.ADMIN))
    )
      return res.status(403).json({ error: "FORBIDDEN" });
  }

  switch (req.method) {
    case "GET":
      return res.status(200).json({ user });

    case "DELETE":
      const deletedUser = await prisma.user
        .delete({
          where: { id: id as string },
        })
        .catch((err) => logger.error(err));

      if (!deletedUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      // delete auth user
      return await deleteUser(deletedUser.authId)
        .then((supertokensRes) => {
          if (supertokensRes.status === "OK")
            return res.status(200).json({ user: deletedUser });
          else return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        })
        .catch((err) => logger.error(err));

    case "POST":
      // if the update comes from a USER or ORGCONTROLLER, disregard some changes
      if (reqUser.role === "USER" || reqUser.role === "ORGCONTROLLER") {
        console.log(req.body);
        if (
          req.body.organization &&
          req.body.organization?.connect?.id !== reqUser.organizationId
        )
          return res.status(403).json({ error: "FORBIDDEN" });
        if (req.body.role) {
          if (req.body.role === "ADMIN" || req.body.role === "CONTROLLER")
            return res.status(403).json({ error: "FORBIDDEN" });
        }
      }

      // if the update changed the user's email, we have to update the supertokens-user as well
      if (req.body?.email) {
        if (!isValidEmail(req.body.email))
          return res.status(400).json({ error: "INVALID_EMAIL" });

        const authUser = await EmailPassword.getUserByEmail(user.email);

        if (!authUser) return res.status(404).json({ error: "NOT_FOUND" });

        const result = await EmailPassword.updateEmailOrPassword({
          userId: authUser.id,
          email: req.body.email,
        });

        if (result.status !== "OK")
          return res.status(409).json({ error: result.status });
      }

      if (req.body.organization.connect.id === "none")
        req.body.organization = { disconnect: true };
      const updatedUser = await prisma.user
        .update({
          where: { id: id as string },
          data: req.body,
          include: { organization: true, subOrganizations: true },
        })
        .catch((err) => logger.error(err));

      if (!updatedUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ user: updatedUser });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

