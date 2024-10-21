import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { logger } from "@/config/logger";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

supertokens.init(backendConfig());

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

  switch (req.method) {
    case "GET":
      const masterData = await prisma.masterData.findMany();
      return res.status(200).json({ masterData });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
