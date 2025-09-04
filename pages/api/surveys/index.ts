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

supertokens.init(backendConfig());

export interface ISurveys {
  surveys?: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: {
          selectOptions: true;
          defaultAnswerSelectOptions: true;
        };
        masterDataType: {
          include: {
            dataFields: {
              include: { selectOptions: true; triggeredSurvey: true };
            };
          };
        };
      };
    };
  }>[];
  survey?: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: {
          selectOptions: true;
          defaultAnswerSelectOptions: true;
        };
        masterDataType: {
          include: {
            dataFields: {
              include: { selectOptions: true; triggeredSurvey: true };
            };
          };
        };
      };
    };
  }>;
  error?: "INTERNAL_SERVER_ERROR" | "METHOD_NOT_ALLOWED";
}

export default async function surveys(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response,
) {
  const logger = _logger.child({
    endpoint: `/surveys`,
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
    res,
  );
  // if it comes here, it means that the session verification was successful
  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  // if the user is USER or ORGCONTROLLER, we need to filter the surveys
  let organizationId = undefined;
  if (user.role === Role.USER || user.role === Role.ORGCONTROLLER)
    organizationId = user.organizationId;

  switch (req.method) {
    case "GET":
      // filter to get all surveys that are not from a *different* organization
      let where: Prisma.SurveyWhereInput = {};
      if (organizationId)
        where.OR = [
          { organizationId: organizationId },
          { organizationId: null },
        ];

      const surveys = await prisma.survey
        .findMany({
          where,
          include: {
            questions: {
              include: {
                selectOptions: true,
                defaultAnswerSelectOptions: true,
              },
            },
            masterDataType: {
              include: {
                dataFields: {
                  include: { selectOptions: true, triggeredSurvey: true },
                },
              },
            },
          },
        })
        .catch((err) => logger.error(err));

      if (!surveys)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ surveys });

    case "POST":
      const surveyInput = req.body as Prisma.SurveyCreateInput;

      surveyInput.createdBy = { connect: { id: user.id } };

      const newSurvey = await prisma.survey
        .create({
          data: {
            ...surveyInput,
            organization: organizationId
              ? { connect: { id: organizationId } }
              : surveyInput.organization,
          },
          include: {
            questions: {
              include: {
                selectOptions: true,
                defaultAnswerSelectOptions: true,
              },
            },
            masterDataType: {
              include: {
                dataFields: {
                  include: { selectOptions: true, triggeredSurvey: true },
                },
              },
            },
          },
        })
        .catch((err) => logger.error(err));

      if (!newSurvey)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ survey: newSurvey });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
