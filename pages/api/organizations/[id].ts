import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "../../../db/prisma";
import { Prisma } from "@prisma/client";

supertokens.init(backendConfig());

export interface IOrganizations {
  organization?: Prisma.OrganizationGetPayload<{}>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "UNAUTHORIZED"
    | "NOT_FOUND";
}

export default async function organizations(
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

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  switch (req.method) {
    case "GET":
      let organization;
      try {
        organization = await prisma.organization.findUnique({
          where: { id: id as string },
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

      return res.status(200).json({ organization });

    case "POST":
      if (user.role !== "ADMIN")
        return res.status(401).json({ error: "UNAUTHORIZED" });

      const newOrg = await prisma.organization
        .create({ data: req.body })
        .catch((err) => console.log(err));

      if (!newOrg)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ organization: newOrg });

    case "DELETE":
      if (user.role !== "ADMIN")
        return res.status(401).json({ error: "UNAUTHORIZED" });

      const deletedOrg = await prisma.organization
        .delete({ where: { id: id as string } })
        .catch((err) => console.log(err));

      if (!deletedOrg)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ organization: deletedOrg });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
