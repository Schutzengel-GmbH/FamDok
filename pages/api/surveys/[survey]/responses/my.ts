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
import { FullResponse } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface IResponses {
  responses?: FullResponse[];
  response?: FullResponse;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN";
}

export default async function myResponses(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}/responses`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
  });

  logger.info("accessed endpoint");

  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );
  // if it comes here, it means that the session verification was successful
  const { survey: surveyId, whereInput } = req.query;

  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const survey = await prisma.survey
    .findUniqueOrThrow({ where: { id: surveyId as string } })
    .catch((err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      )
        return res.status(404).json({ error: "NOT_FOUND" });

      logger.error(err);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    });

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  // we need to check if the user is allowed to access this survey
  if (
    (user.role === Role.USER || user.role === Role.ORGCONTROLLER) &&
    survey.organizationId &&
    user.organizationId !== survey.organizationId
  )
    return res.status(403).json({ error: "FORBIDDEN" });

  let where: Prisma.ResponseWhereInput = {
    survey: { id: surveyId as string },
  };
  where.userId = user.id;

  const extraWhereInput = whereInput ? JSON.parse(whereInput as string) : {};
  where = { ...extraWhereInput, ...where };

  switch (req.method) {
    case "GET":
      const responses = await prisma.response
        .findMany({
          where,
          include: {
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
                question: { include: { selectOptions: true } },
              },
            },
            user: true,
            family: {
              include: { caregivers: true, children: true, comingFrom: true },
            },
            child: true,
            caregiver: true,
            masterData: {
              include: {
                answers: {
                  include: {
                    answerCollection: {
                      include: {
                        collectionDataDate: true,
                        collectionDataFloat: true,
                        collectionDataInt: true,
                        collectionDataString: true,
                      },
                    },
                    answerSelect: true,
                  },
                },
                masterDataType: {
                  include: { dataFields: { include: { selectOptions: true } } },
                },
              },
            },
          },
        })
        .catch((err) => logger.error(err));

      if (!responses)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ responses });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

