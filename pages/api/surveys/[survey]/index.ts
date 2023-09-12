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

export interface ISurvey {
  survey?: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: {
          selectOptions: true;
          defaultAnswerSelectOptions: true;
        };
      };
    };
  }>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN";
}

export default async function survey(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}`,
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

  const { survey: surveyId } = req.query;

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let survey;
  try {
    survey = await prisma.survey.findUniqueOrThrow({
      where: { id: surveyId as string },
      include: {
        questions: {
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        },
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "NOT_FOUND" });

    logger.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  if (
    survey.organizationId &&
    (user.role === Role.USER || user.role === Role.ORGCONTROLLER) &&
    survey.organizationId !== user.organizationId
  )
    return res.status(403).json({ error: "FORBIDDEN" });

  switch (req.method) {
    case "GET":
      return res.status(200).json({ survey });

    case "POST":
      if (user.role === Role.USER)
        return res.status(403).json({ error: "FORBIDDEN" });

      if (user.role === Role.ORGCONTROLLER)
        if (user.organizationId !== survey.organizationId)
          return res.status(403).json({ error: "FORBIDDEN" });

      const updatedSurvey = await prisma.survey
        .update({ where: { id: surveyId as string }, data: req.body })
        .catch((err) => logger.error(err));

      if (!updatedSurvey)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ survey: updatedSurvey });

    case "DELETE":
      if (user.role === Role.USER)
        return res.status(403).json({ error: "FORBIDDEN" });

      const deletedSurvey = await prisma.survey
        .delete({ where: { id: surveyId as string } })
        .catch((err) => logger.error(err));

      if (!deletedSurvey)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      return res.status(200).json({ survey: deletedSurvey });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

