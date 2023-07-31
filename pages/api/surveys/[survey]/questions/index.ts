import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import { Response } from "express";
import { Prisma, Role } from "@prisma/client";
import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";

supertokens.init(backendConfig());

export interface IQuestions {
  questions?: Prisma.QuestionGetPayload<{
    include: { selectOptions: true; defaultAnswerSelectOptions: true };
  }>[];
  question?: Prisma.QuestionGetPayload<{
    include: { selectOptions: true; defaultAnswerSelectOptions: true };
  }>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN";
}

export default async function questions(
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

  const { survey: surveyId } = req.query;

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let survey: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: { selectOptions: true; defaultAnswerSelectOptions: true };
      };
    };
  }>;
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

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  switch (req.method) {
    case "GET":
      return res.status(200).json({ questions: survey.questions });

    case "POST":
      if (
        user.role === Role.USER ||
        (user.role === Role.ORGCONTROLLER &&
          user.organizationId !== survey.organizationId)
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      const questionInput = req.body;
      questionInput.survey = { connect: { id: surveyId as string } };
      console.log(questionInput);

      const question = await prisma.question
        .create({
          data: questionInput,
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        })
        .catch((err) => console.log(err));

      if (!question)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ question });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
