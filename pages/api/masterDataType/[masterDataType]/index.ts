import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { logger as _logger } from "@/config/logger";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import { MasterDataType, Prisma, Role } from "@prisma/client";
import { hasOneOfRole } from "@/utils/authUtils";
import { ApiError } from "@/utils/utils";

export interface IMasterDataTypeByID {
  update?: Prisma.MasterDataTypeGetPayload<{ include: { dataFields: { include: { selectOptions: true } } } }>;
  deleteRes?: MasterDataType;
  error?: ApiError;
}

export default async function masterDataType(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `masterDataType`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
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

  const { masterDataType: id } = req.query;

  switch (req.method) {
    case "GET":
      const masterDataType = await prisma.masterDataType
        .findUnique({ where: { id: id as string } })
        .catch((e) => logger.error(e));

      return res.status(200).json({ masterDataType });
    case "POST":
      const data = req.body as Prisma.MasterDataUpdateInput;
      const update = await prisma.masterDataType
        .update({ where: { id: id as string }, data, include: { dataFields: { include: { selectOptions: true } } } })
        .catch((e) => logger.error(e));

      if (!update)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      if (
        !hasOneOfRole(
          user,
          [Role.ADMIN, Role.CONTROLLER, Role.ORGCONTROLLER],
          update.organizationId
        )
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      return res.status(200).json({ update });
    case "DELETE":
      const mdtToDelete = await prisma.masterDataType
        .findUnique({ where: { id: id as string } })
        .catch((e) => logger.error(e));

      if (!mdtToDelete)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      if (
        !hasOneOfRole(
          user,
          [Role.ADMIN, Role.CONTROLLER, Role.ORGCONTROLLER],
          mdtToDelete.organizationId
        )
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      const deleteRes = await prisma.masterDataType
        .delete({ where: { id: id as string } })
        .catch((e) => logger.error(e));

      return res.status(200).json({ deleteRes });
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}