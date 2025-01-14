import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { logger } from "@/config/logger";
import { prisma } from "@/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { MasterData, Prisma, Role } from "@prisma/client";
import { ApiError } from "@/utils/utils";
import { FullMasterData } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface IMasterData {
  createRes?: MasterData;
  masterData?: FullMasterData[];
  error?: ApiError;
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

  const { masterDataType: masterDataTypeId, whereInput } = req.query;

  const masterDataType = await prisma.masterDataType
    .findUnique({ where: { id: masterDataTypeId as string } })
    .catch((e) => logger.error(e));

  if (!masterDataType)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  if (reqUser.role === Role.USER || reqUser.role === Role.ORGCONTROLLER)
    if (
      masterDataType.isLimitedToOrg &&
      reqUser.organizationId !== masterDataType.organizationId
    )
      return res.status(403).json({ error: "FORBIDDEN" });

  switch (req.method) {
    case "GET":
      let where: Prisma.MasterDataWhereInput = whereInput
        ? JSON.parse(whereInput as string)
        : {};

      where.masterDataTypeId = masterDataType.id;
      where.createdBy =
        reqUser.role === "USER" || reqUser.role === "ORGCONTROLLER"
          ? { organizationId: reqUser.organizationId }
          : undefined;

      const masterData = await prisma.masterData.findMany({
        where,
        include: {
          masterDataType: {
            include: {
              dataFields: {
                include: { selectOptions: true },
                orderBy: { createdAt: "asc" },
              },
              organization: true,
            },
          },
          createdBy: { include: { organization: true } },
          answers: {
            include: {
              answerSelect: true,
              answerCollection: {
                include: {
                  collectionDataDate: true,
                  collectionDataFloat: true,
                  collectionDataInt: true,
                  collectionDataString: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      return res.status(200).json({ masterData });
    case "POST":
      const data = req.body as Prisma.MasterDataCreateInput;

      if (reqUser.role === Role.USER)
        data.createdBy = { connect: { id: reqUser.id } };

      const createRes = await prisma.masterData
        .create({ data })
        .catch((e) => logger.error(e));
      return res.status(200).json({ createRes });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
