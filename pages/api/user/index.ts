import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import { prisma } from "../../../db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { Role, User } from "@prisma/client";
import { getUserWhereInput } from "../../../utils/backendUtils";

supertokens.init(backendConfig());

export interface IUsers {
  user?: User;
  users?: User[];
  error?:
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "UNAUTHORIZED";
}

export default async function users(
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

  const where = getUserWhereInput(req.query);

  const reqUser = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!reqUser || reqUser.role === Role.USER)
    return res.status(401).json({ error: "UNAUTHORIZED" });

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
        })
        .catch((err) => console.log(err));

      if (!users)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ users });

    case "POST":
      const newUser = await prisma.user
        .create({
          data: {
            ...req.body,
            organizationId: organizationId ?? req.body.organizationId,
          },
        })
        .catch((err) => console.log(err));

      if (!newUser)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ user: newUser });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
