import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { logger as _logger } from "@/config/logger";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import { MasterData, Prisma, Role } from "@prisma/client";
import { ApiError } from "@/utils/utils";
import { FullMasterData } from "@/types/prismaHelperTypes";
import { hasOneOfRole } from "@/utils/authUtils";

export interface IMasterDataByNumber {
  updateRes?: MasterData;
  deleteRes?: MasterData;
  masterData?: FullMasterData;
  error?: ApiError;
}

export default async function masterDataType(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/families/${req.query.family}`,
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

  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const { masterDataType: masterDataTypeID, number } = req.query;
  if (!Number.isInteger(Number(number)))
    return res.status(400).json({ error: "BAD_INPUT" });

  const masterDataType = await prisma.masterDataType
    .findUnique({ where: { id: masterDataTypeID as string } })
    .catch(logger.error);

  if (!masterDataType) return res.status(404).json({ error: "NOT_FOUND" });

  const where: Prisma.MasterDataWhereUniqueInput = {
    id: { masterDataTypeName: masterDataType.name, number: Number(number) },
  };

  const masterData = await prisma.masterData
    .findUnique({
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
    })
    .catch((e) => logger.error(e));

  if (!masterData) return res.status(404).json({ error: "NOT_FOUND" });

  let canEdit = hasOneOfRole(user, [
    Role.ADMIN,
    Role.CONTROLLER,
    Role.ORGCONTROLLER,
  ]);

  if (user.role === Role.USER)
    if (masterData.userId === user.id) canEdit = true;

  if (user.role === Role.ORGCONTROLLER)
    if (
      masterDataType.isLimitedToOrg &&
      masterDataType.organizationId &&
      masterDataType.organizationId !== user.organizationId
    )
      canEdit = false;

  switch (req.method) {
    case "GET":
      if (
        user.role === "USER" &&
        masterData.createdBy.organizationId !== user.organizationId
      )
        return res.status(403).json({ error: "FORBIDDEN" });
      return res.status(200).json({ masterData });
    case "POST":
      if (!canEdit) return res.status(403).json({ error: "FORBIDDEN" });

      const data = req.body as Prisma.MasterDataUpdateInput;

      const updateRes = await prisma.masterData
        .update({ where, data })
        .catch((e) => logger.error(e));

      return res.status(200).json({ updateRes });
    case "DELETE":
      if (!canEdit) return res.status(403).json({ error: "FORBIDDEN" });

      const deleteRes = await prisma.masterData
        .delete({ where })
        .catch(logger.error);
      return res.status(200).json({ deleteRes });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
