import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { Prisma, Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Response } from "express";
import { PartialAnswer } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface ISubmitAnswer {
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "SURVEY_NOT_FOUND"
    | "RESPONSE_NOT_FOUND"
    | "FORBIDDEN";
}

export default async function survey(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  const { survey: surveyId, response: responseId } = req.query;

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => console.log(err));

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
      return res.status(404).json({ error: "SURVEY_NOT_FOUND" });

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  if (
    survey.organizationId &&
    (user.role === Role.USER || user.role === Role.ORGCONTROLLER) &&
    survey.organizationId !== user.organizationId
  )
    return res.status(403).json({ error: "FORBIDDEN" });

  let response;
  try {
    response = await prisma.response.findUniqueOrThrow({
      where: { id: responseId as string },
      include: { answers: { include: { answerSelect: true } } },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "RESPONSE_NOT_FOUND" });

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  const { answersState } = req.body as {
    answersState: PartialAnswer[];
  };

  let errors: any[];

  for (const answer of answersState) {
    let result;
    if (answer.id) {
      result = await prisma.answer.update({
        where: { id: answer.id },
        data: {
          answerBool: answer.answerBool,
          answerDate: answer.answerDate,
          answerInt: answer.answerInt,
          answerNum: answer.answerNum,
          answerSelect: {
            set: answer.answerSelect.map((a) => ({ id: a.id })),
          },
          answerSelectOtherValues: answer.answerSelectOtherValues || undefined,
          answerText: answer.answerText,
        },
      });
    } else {
      result = await prisma.answer.create({
        data: {
          answerBool: answer.answerBool,
          answerDate: answer.answerDate,
          answerInt: answer.answerInt,
          answerNum: answer.answerNum,
          answerSelect: {
            connect: answer.answerSelect.map((a) => ({ id: a.id })),
          },
          answerSelectOtherValues: answer.answerSelectOtherValues || undefined,
          answerText: answer.answerText,
          question: { connect: { id: answer.questionId } },
          response: { connect: { id: response.id } },
        },
      });
    }
  }

  if (errors?.length > 0)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  else return res.status(200).json({});
}
