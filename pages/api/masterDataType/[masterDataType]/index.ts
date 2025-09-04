import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { logger as _logger } from "@/config/logger";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import { MasterDataType, Prisma, Role } from "@prisma/client";
import { hasOneOfRole } from "@/utils/authUtils";
import { ApiError } from "@/utils/utils";
import { FullMasterDataType } from "@/types/prismaHelperTypes";

export interface IMasterDataTypeByID {
  masterDataType: FullMasterDataType;
  update?: Prisma.MasterDataTypeGetPayload<{
    include: { dataFields: { include: { selectOptions: true } } };
  }>;
  deleteRes?: MasterDataType;
  error?: ApiError;
}

export interface IMasterDataTypeByIdBody {
  dataFieldId?: string;
  dataFieldUpdate?: Prisma.DataFieldUpdateInput;
  dataFieldsToDelete?: { id: string }[];
  update?: Prisma.MasterDataTypeUpdateInput;
  selectOptions?: {
    id?: string;
    value: string;
    isOpen?: boolean;
    info?: string;
  }[];
}

export default async function masterDataType(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response,
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
    res,
  );

  let session = req.session;
  const reqUser = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!reqUser) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const { masterDataType: id } = req.query;

  const masterDataType = await prisma.masterDataType
    .findUniqueOrThrow({
      where: { id: id as string },
      include: {
        dataFields: {
          include: { selectOptions: true, triggeredSurvey: true },
          orderBy: { createdAt: "asc" },
        },
        organization: true,
      },
    })
    .catch((e) => logger.error(e));

  if (!masterDataType) return res.status(404).json({ error: "NOT_FOUND" });

  switch (req.method) {
    case "GET":
      return res.status(200).json({ masterDataType });
    case "POST":
      if (
        !hasOneOfRole(reqUser, [
          Role.ADMIN,
          Role.CONTROLLER,
          Role.ORGCONTROLLER,
        ])
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      const data = req.body as IMasterDataTypeByIdBody;

      const currentSelectOptions =
        masterDataType.dataFields.find((df) => df.id === data.dataFieldId)
          ?.selectOptions || [];

      const selectOptionsToDelete = currentSelectOptions.filter(
        (c) => !data.selectOptions?.map((o) => o.id).includes(c.id),
      );
      const selectOptionsToUpdate = data.selectOptions?.filter((so) => so.id);
      const selectOptionsToCreate = data.selectOptions?.filter((so) => !so.id);

      let dataFields: any = {};

      if (
        selectOptionsToDelete.length > 0 ||
        selectOptionsToUpdate ||
        selectOptionsToCreate
      )
        dataFields.update = {
          where: { id: data.dataFieldId },
          data: {
            ...data.dataFieldUpdate,
            selectOptions: {
              deleteMany: selectOptionsToDelete,
              updateMany: selectOptionsToUpdate?.map((so) => ({
                where: { id: so.id },
                data: so,
              })),
              create: selectOptionsToCreate,
            },
          },
        };
      else if (data.dataFieldUpdate)
        dataFields.update = {
          where: { id: data.dataFieldId },
          data: {
            ...data.dataFieldUpdate,
          },
        };

      if (data.update?.dataFields?.create)
        dataFields.create = data.update.dataFields.create;

      if (data.dataFieldsToDelete) {
        dataFields.deleteMany = data.dataFieldsToDelete.map((x) => ({
          id: x.id,
        }));
      }

      const update = await prisma.masterDataType
        .update({
          where: { id: id as string },
          data: {
            ...data.update,
            dataFields,
          },
          include: { dataFields: { include: { selectOptions: true } } },
        })
        .catch((e) => logger.error(e));

      if (!update)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      if (
        !hasOneOfRole(
          reqUser,
          [Role.ADMIN, Role.CONTROLLER, Role.ORGCONTROLLER],
          update.organizationId,
        )
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      return res.status(200).json({ update });
    case "DELETE":
      if (
        !hasOneOfRole(reqUser, [
          Role.ADMIN,
          Role.CONTROLLER,
          Role.ORGCONTROLLER,
        ])
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      const mdtToDelete = await prisma.masterDataType
        .findUnique({ where: { id: id as string } })
        .catch((e) => logger.error(e));

      if (!mdtToDelete)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      if (
        !hasOneOfRole(
          reqUser,
          [Role.ADMIN, Role.CONTROLLER, Role.ORGCONTROLLER],
          mdtToDelete.organizationId,
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
