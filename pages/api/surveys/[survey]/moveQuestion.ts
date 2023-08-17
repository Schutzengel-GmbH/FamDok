import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Prisma, Role } from "@prisma/client";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { range } from "@/utils/utils";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IMoveQuestion {
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN"
    | "NEW_POSITION_OUT_OF_RANGE";
}

export interface IMoveQuestionInput {
  questionId: string;
  newPosition: number;
}

export default async function moveQuestion(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}/moveQuestion`,
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

  let survey: FullSurvey;
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

  const input = req.body as IMoveQuestionInput;

  let q = survey.questions.find((q) => q.id === input.questionId);

  if (input.newPosition === 0 || input.newPosition > survey.questions.length)
    return res.status(400).json({ error: "NEW_POSITION_OUT_OF_RANGE" });

  if (q.numberInSurvey === input.newPosition) return res.status(200).json({});

  if (q.numberInSurvey < input.newPosition) {
    // -1 for all num in between old and new, then update to new position
    let update = await prisma.question.updateMany({
      where: {
        AND: {
          surveyId: survey.id,
          numberInSurvey: { in: range(q.numberInSurvey, input.newPosition) },
        },
      },
      data: { numberInSurvey: { decrement: 1 } },
    });

    let update2 = await prisma.question.update({
      where: { id: input.questionId },
      data: { numberInSurvey: input.newPosition },
    });

    res.status(200).json({ update, update2 });
  }

  if (q.numberInSurvey > input.newPosition) {
    // +1 for all num in between old and new, then update to new position
    let update = await prisma.question.updateMany({
      where: {
        AND: {
          surveyId: survey.id,
          numberInSurvey: { in: range(input.newPosition, q.numberInSurvey) },
        },
      },
      data: { numberInSurvey: { increment: 1 } },
    });

    let update2 = await prisma.question.update({
      where: { id: input.questionId },
      data: { numberInSurvey: input.newPosition },
    });

    res.status(200).json({ update, update2 });
  }
}
