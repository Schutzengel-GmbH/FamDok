import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { logger as _logger } from "@/config/logger";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import { Prisma, Role } from "@prisma/client";
import { ApiError } from "@/utils/utils";
import { FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { de } from "date-fns/locale";

export interface ISubmitMasterDataAnswers {
  error?: ApiError;
}

export default async function submitAnswers(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/masterDataType/${req.query.masterDataType}/${req.query.masterData}/${req.query.number}`,
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
            dataFields: { include: { selectOptions: true } },
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

  let canEdit = true;

  if (user.role === Role.USER)
    if (masterData.userId !== user.id) canEdit = false;

  if (user.role === Role.ORGCONTROLLER)
    if (
      masterDataType.isLimitedToOrg &&
      masterDataType.organizationId &&
      masterDataType.organizationId !== user.organizationId
    )
      canEdit = false;

  if (!canEdit) return res.status(403).json({ error: "FORBIDDEN" });

  const connectMasterData = {
    connect: {
      id: {
        masterDataTypeName: masterData.masterDataTypeName,
        number: masterData.number,
      },
    },
  };

  switch (req.method) {
    case "POST":
      const answerStates = req.body as Partial<FullDataFieldAnswer>[];
      console.log(JSON.stringify(answerStates, null, 4));

      let errors: boolean = false;
      for (let i = 0; i < answerStates.length; i++) {
        const answerState = answerStates[i];

        if (answerState.id) {
          try {
            const update = await prisma.dataFieldAnswer
              .update({
                where: { id: answerState.id },
                data: {
                  answerBool: answerState.answerBool ?? undefined,
                  answerDate: answerState.answerDate ?? undefined,
                  answerInt: answerState.answerInt ?? undefined,
                  answerNum: answerState.answerNum ?? undefined,
                  answerText: answerState.answerText ?? undefined,
                  selectOtherValues: answerState.selectOtherValues ?? undefined,

                  answerSelect: answerState.answerSelect
                    ? {
                        set: answerState.answerSelect.map((s) => ({
                          id: s.id,
                        })),
                      }
                    : undefined,
                  masterDataMasterDataTypeName: masterData.masterDataTypeName,
                  masterDataNumber: masterData.number,
                },
              })
              .catch((e) => {
                logger.error(e);
                console.log(e);
                errors = true;
              });
            if (answerState.answerCollection) {
              await prisma.collection.update({
                where: { id: answerState.answerCollection.id },
                data: {
                  type: answerState.answerCollection.type,
                  DataFieldAnswer: { connect: { id: answerState.id } },
                  collectionDataDate: answerState.answerCollection
                    .collectionDataDate
                    ? {
                        deleteMany:
                          answerState.answerCollection.collectionDataFloat.map(
                            (d) => ({ id: d.id })
                          ),
                        createMany: {
                          data: answerState.answerCollection.collectionDataDate.map(
                            (d) => {
                              delete d.collectionId;
                              delete d.id;
                              return d;
                            }
                          ),
                        },
                      }
                    : undefined,
                  collectionDataFloat: answerState.answerCollection
                    .collectionDataFloat
                    ? {
                        deleteMany:
                          answerState.answerCollection.collectionDataFloat.map(
                            (d) => ({ id: d.id })
                          ),
                        createMany: {
                          data: answerState.answerCollection.collectionDataFloat.map(
                            (d) => {
                              delete d.collectionId;
                              delete d.id;
                              return d;
                            }
                          ),
                        },
                      }
                    : undefined,
                  collectionDataInt: answerState.answerCollection
                    .collectionDataInt
                    ? {
                        deleteMany:
                          answerState.answerCollection.collectionDataFloat.map(
                            (d) => ({ id: d.id })
                          ),
                        createMany: {
                          data: answerState.answerCollection.collectionDataInt.map(
                            (d) => {
                              delete d.collectionId;
                              delete d.id;
                              return d;
                            }
                          ),
                        },
                      }
                    : undefined,
                  collectionDataString: answerState.answerCollection
                    .collectionDataString
                    ? {
                        deleteMany:
                          answerState.answerCollection.collectionDataFloat.map(
                            (d) => ({ id: d.id })
                          ),
                        createMany: {
                          data: answerState.answerCollection.collectionDataString.map(
                            (d) => {
                              delete d.collectionId;
                              delete d.id;
                              return d;
                            }
                          ),
                        },
                      }
                    : undefined,
                },
              });
            }
          } catch (e) {
            logger.error(e);
            console.log(e);
            errors = true;
          }
        } else {
          try {
            const create = await prisma.dataFieldAnswer
              .create({
                data: {
                  dataField: { connect: { id: answerState.dataFieldId } },
                  answerBool: answerState.answerBool ?? undefined,
                  answerDate: answerState.answerDate ?? undefined,
                  answerInt: answerState.answerInt ?? undefined,
                  answerNum: answerState.answerNum ?? undefined,
                  answerText: answerState.answerText ?? undefined,
                  answerCollection: answerState.answerCollection
                    ? {
                        create: {
                          type: answerState.answerCollection.type,
                          collectionDataDate: answerState.answerCollection
                            .collectionDataDate
                            ? {
                                createMany: {
                                  data: answerState.answerCollection
                                    .collectionDataDate,
                                },
                              }
                            : undefined,
                          collectionDataFloat: answerState.answerCollection
                            .collectionDataFloat
                            ? {
                                createMany: {
                                  data: answerState.answerCollection
                                    .collectionDataFloat,
                                },
                              }
                            : undefined,
                          collectionDataInt: answerState.answerCollection
                            .collectionDataInt
                            ? {
                                createMany: {
                                  data: answerState.answerCollection
                                    .collectionDataInt,
                                },
                              }
                            : undefined,
                          collectionDataString: answerState.answerCollection
                            .collectionDataString
                            ? {
                                createMany: {
                                  data: answerState.answerCollection
                                    .collectionDataString,
                                },
                              }
                            : undefined,
                        },
                      }
                    : undefined,
                  selectOtherValues: answerState.selectOtherValues ?? undefined,
                  answerSelect: answerState.answerSelect
                    ? {
                        connect: answerState.answerSelect.map((s) => ({
                          id: s.id,
                        })),
                      }
                    : undefined,
                  masterData: connectMasterData,
                },
              })
              .catch((e) => {
                logger.error(e);
                errors = true;
              });
          } catch (e) {
            logger.error(e);
            errors = true;
          }
        }
      }

      return res.status(200).json({});
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
