import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens, { deleteUser } from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { Prisma, Role, User } from "@prisma/client";

supertokens.init(backendConfig());

export interface IUser {
  user?: Prisma.UserGetPayload<{ include: { organization: true } }>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "NOT_FOUND"
    | "FORBIDDEN"
    | "METHOD_NOT_ALLOWED";
}

export default async function user(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
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
    .catch((err) => console.log(err));

  if (!reqUser) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let user: User;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { id: id as string },
      include: { organization: true },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "NOT_FOUND" });

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

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

  switch (req.method) {
    case "GET":
      return res.status(200).json({ user });

    case "DELETE":
      const deletedUser = await prisma.user
        .delete({
          where: { id: id as string },
        })
        .catch((err) => console.log(err));

      if (!deletedUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      // delete auth user
      return await deleteUser(deletedUser.authId)
        .then((supertokensRes) => {
          if (supertokensRes.status === "OK")
            return res.status(200).json({ user: deletedUser });
          else return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        })
        .catch((err) => console.log(err));

    case "POST":
      if (req.body.organization.connect.id === "none")
        req.body.organization = { disconnect: true };
      const updatedUser = await prisma.user
        .update({
          where: { id: id as string },
          data: req.body,
          include: { organization: true },
        })
        .catch((err) => console.log(err));

      if (!updatedUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ user: updatedUser });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
