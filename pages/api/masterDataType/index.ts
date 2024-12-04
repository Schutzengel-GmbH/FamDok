import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { logger } from "@/config/logger";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Prisma, Role } from "@prisma/client";
import { hasOneOfRole } from "@/utils/authUtils";
import { ApiError } from "@/utils/utils";
import { FullMasterDataType } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface IMasterDataType {
  masterDataType?: FullMasterDataType;
  masterDataTypes?: FullMasterDataType[];
  error?: ApiError;
}

export default async function masterData(
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

      // if (reqUser.role === "USER" || reqUser.role === "ORGCONTROLLER") {
      //   masterDataTypes = await prisma.masterDataType.findMany({
      //     where: {
      //       OR: [
      //         { NOT: { isLimitedToOrg: true } },
      //         { organizationId: reqUser.organizationId },
      //       ],
      //     },
      //     include: {
      //       dataFields: { include: { selectOptions: true } },
      //       organization: true,
      //     },
      //   });
      //   return;
      // } else {
      masterDataTypes = await prisma.masterDataType.findMany({
        include: {
          dataFields: {
            include: { selectOptions: true },
            orderBy: { createdAt: "asc" },
          },
          organization: true,
        },
        orderBy: { createdAt: "asc" },
      });
      return res.status(200).json({ masterDataTypes });
    // }
    case "POST":
      const data = req.body as Prisma.MasterDataTypeCreateInput;

      if (
        data.isLimitedToOrg &&
        reqUser.role !== "ADMIN" &&
        reqUser.role !== "CONTROLLER"
      )
        data.organization = { connect: { id: reqUser.organizationId } };

      if (
        !hasOneOfRole(
          reqUser,
          [Role.ADMIN, Role.CONTROLLER, Role.ORGCONTROLLER],
          data?.organization?.connect?.id
        )
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      const masterDataType = await prisma.masterDataType
        .create({ data })
        .catch((e) => {
          logger.error(e);
          return res
            .status(500)
            .json({ error: "INTERNAL_SERVER_ERROR", message: e });
        });
      res.status(200).json({ masterDataType });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
