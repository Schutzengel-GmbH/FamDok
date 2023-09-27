import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "express";
import { backendConfig } from "@/config/backendConfig";
import supertokens from "supertokens-node/lib/build/supertokens";
import { ComingFromOption, PossibleLocation, Prisma } from "@prisma/client";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { prisma } from "@/db/prisma";
import { logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IComingFromOptions {
  comingFromOptions?: ComingFromOption[];
  error?: "METHOD_NOT_ALLOWED" | "INTERNAL_SERVER_ERROR";
}

export default async function footerPages(
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

  switch (req.method) {
    case "GET":
      const comingFromOptions = await prisma.comingFromOption
        .findMany()
        .catch((err) => logger.error(err));

      return res.status(200).json({ comingFromOptions });
    case "POST":
      if (reqUser.role === "USER")
        return res.status(403).json({ error: "FORBIDDEN" });

      let data = req.body as Prisma.ComingFromOptionCreateInput;
      const newLocation = await prisma.comingFromOption
        .create({
          data,
        })
        .catch((err) => logger.error(err));
      if (!newLocation)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({});
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

