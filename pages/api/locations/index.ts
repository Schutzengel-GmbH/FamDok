import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "express";
import { backendConfig } from "@/config/backendConfig";
import supertokens from "supertokens-node/lib/build/supertokens";
import { PossibleLocation, Prisma } from "@prisma/client";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { prisma } from "@/db/prisma";
import { logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface ILocations {
  locations?: PossibleLocation[];
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

  switch (req.method) {
    case "GET":
      const locations = await prisma.possibleLocation
        .findMany()
        .catch((err) => logger.error(err));

      return res.status(200).json({ locations });
    case "POST":
      let data = req.body as Prisma.PossibleLocationCreateInput;
      const newLocation = await prisma.possibleLocation
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

