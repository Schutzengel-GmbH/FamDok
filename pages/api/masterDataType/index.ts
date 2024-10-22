import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { logger } from "@/config/logger";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Prisma } from "@prisma/client";

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
      let masterDataTypes: Prisma.MasterDataTypeGetPayload<{
        include: { dataFields: true };
      }>[];

      if (reqUser.role === "USER" || reqUser.role === "ORGCONTROLLER") {
        masterDataTypes = await prisma.masterDataType.findMany({
          where: {
            OR: [
              { NOT: { isLimitedToOrg: true } },
              { organizationId: reqUser.organizationId },
            ],
          },
          include: { dataFields: true },
        });
        return;
      } else {
        masterDataTypes = await prisma.masterDataType.findMany({
          include: { dataFields: true },
        });
        return res.status(200).json({ masterDataTypes });
      }
    case "POST":
      const data = req.body as Prisma.MasterDataTypeCreateInput;

      if (
        data.isLimitedToOrg &&
        reqUser.role !== "ADMIN" &&
        reqUser.role !== "CONTROLLER"
      )
        data.organization = { connect: { id: reqUser.organizationId } };

      const masterDataType = await prisma.masterDataType
        .create({ data })
        .catch((e) => {
          logger.error(e);
          return res
            .status(500)
            .json({ error: "INTERNAL_SERVER_ERROR", message: e });
        });
      res.status(200).json({ data });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

