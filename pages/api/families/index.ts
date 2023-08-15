import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { getFamilyWhereInput } from "@/utils/backendUtils";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IFamilies {
  families?: Prisma.FamilyGetPayload<{
    include: { caregivers: true; children: true };
  }>[];
  family?: Prisma.FamilyGetPayload<{
    include: { caregivers: true; children: true };
  }>;
  error?: "INTERNAL_SERVER_ERROR" | "METHOD_NOT_ALLOWED";
}

export default async function families(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: "/families",
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
  });

  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  let session = req.session;

  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const where = getFamilyWhereInput(req.query);

  switch (req.method) {
    case "GET":
      const families = await prisma.family
        .findMany({
          include: { caregivers: true, children: true },
          where,
        })
        .catch((err) => {
          logger.error(err);
        });

      if (!families)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.json({ families });

    case "POST":
      const familyInput = req.body as Prisma.FamilyCreateInput;

      familyInput.createdBy = { connect: { id: user.id } };

      const newFamily = await prisma.family
        .create({ data: familyInput })
        .catch((err) => logger.error(err));

      if (!newFamily)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      else return res.status(200).json({ family: newFamily });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

