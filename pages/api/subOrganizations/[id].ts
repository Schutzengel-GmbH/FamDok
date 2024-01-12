import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Prisma, Role } from "@prisma/client";
import { logger as _logger } from "@/config/logger";
import { FullSubOrganization } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface ISubOrganization {
  subOrganization?: FullSubOrganization;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "FORBIDDEN"
    | "NOT_FOUND";
}

export default async function organizations(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse<ISubOrganization> & Response
) {
  const logger = _logger.child({
    endpoint: `/subOrganizations/${req.query.id}`,
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

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  let subOrganization;
  try {
    subOrganization = await prisma.subOrganization.findUnique({
      where: { id: id as string },
      include: {
        User: { include: { organization: true, subOrganizations: true } },
      },
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

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  switch (req.method) {
    case "GET":
      if (user.role !== Role.ADMIN) {
        if (user.organizationId !== subOrganization.organizationId)
          return res.status(403).json({ error: "FORBIDDEN" });
      }

      return res.status(200).json({ subOrganization });

    case "POST":
      if (user.role !== Role.ADMIN) {
        if (
          user.role === Role.USER ||
          user.organizationId !== subOrganization.organizationId
        )
          return res.status(403).json({ error: "FORBIDDEN" });
      }

      let data = JSON.parse(req.body) as Prisma.SubOrganizationUpdateInput;

      const update = await prisma.subOrganization.update({
        where: { id: id as string },
        data,
      });

      return res.status(200).json({});

    case "DELETE":
      if (user.role !== Role.ADMIN) {
        if (
          user.role === Role.USER ||
          user.organizationId !== subOrganization.organizationId
        )
          return res.status(403).json({ error: "FORBIDDEN" });
      }

      const deletedOrg = await prisma.subOrganization
        .delete({ where: { id: id as string } })
        .catch((err) => logger.error(err));

      if (!deletedOrg)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({});

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
