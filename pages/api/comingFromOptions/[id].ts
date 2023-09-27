import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "express";
import { backendConfig } from "@/config/backendConfig";
import supertokens from "supertokens-node/lib/build/supertokens";
import { ComingFromOption, Prisma, Role } from "@prisma/client";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { prisma } from "@/db/prisma";
import { logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IComingFromOption {
  comingFromOption?: ComingFromOption;
  error?: "METHOD_NOT_ALLOWED" | "INTERNAL_SERVER_ERROR" | "FORBIDDEN";
}

export default async function comingFromOptions(
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

  const reqUser = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!reqUser) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      const location = await prisma.comingFromOption
        .findUnique({ where: { id: id as string } })
        .catch((err) => logger.error(err));

      return res.status(200).json({ location });
    case "POST":
      if (reqUser.role !== Role.ADMIN)
        return res.status(403).json({ error: "FORBIDDEN" });

      let data = req.body as Prisma.ComingFromOptionUpdateInput;
      const update = await prisma.comingFromOption
        .update({
          where: { id: id as string },
          data,
        })
        .catch((err) => logger.error(err));
      if (!update)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({});
    case "DELETE":
      if (reqUser.role === "USER")
        return res.status(403).json({ error: "FORBIDDEN" });

      const deletion = await prisma.comingFromOption.delete({
        where: { id: id as string },
      });

      return res.status(200).json({});
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

