import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IOrganizations {
  organizations?: Prisma.OrganizationGetPayload<{}>[];
  organization?: Prisma.OrganizationGetPayload<{}>;
  error?: "INTERNAL_SERVER_ERROR" | "METHOD_NOT_ALLOWED" | "FORBIDDEN";
}

export default async function organizations(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: "/organizations",
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

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  switch (req.method) {
    case "GET":
      const organizations = await prisma.organization
        .findMany({})
        .catch((err) => logger.error(err));

      if (!organizations)
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ organizations });

    case "POST":
      if (user.role !== "ADMIN")
        return res.status(403).json({ error: "FORBIDDEN" });

      const newOrg = await prisma.organization
        .create({ data: req.body })
        .catch((err) => logger.error(err));

      if (!newOrg)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ organization: newOrg });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
