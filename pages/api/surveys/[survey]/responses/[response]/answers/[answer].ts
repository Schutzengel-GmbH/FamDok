import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../../../../../config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "../../../../../../../db/prisma";
import { Prisma, Role } from "@prisma/client";

supertokens.init(backendConfig());

export interface IAnswer {
  answer?: Prisma.AnswerGetPayload<{
    include: {
      answerSelect: true;
      question: {
        include: {
          defaultAnswerSelectOptions: true;
          selectOptions: true;
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

export default async function organizations(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  const {
    survey: surveyId,
    response: responseId,
    answer: answerId,
  } = req.query;

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const survey = await prisma.survey
    .findUnique({ where: { id: surveyId as string } })
    .catch((err) => console.log(err));

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let response: Prisma.ResponseGetPayload<{
    include: { answers: { include: { answerSelect: true } }; user: true };
  }>;

  try {
    response = await prisma.response.findUniqueOrThrow({
      where: { id: responseId as string },
      include: { answers: { include: { answerSelect: true } }, user: true },
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

  if (user.role === Role.USER && response.userId !== user.id)
    return res.status(403).json({ error: "FORBIDDEN" });

  if (
    user.role === Role.ORGCONTROLLER &&
    response.user.organizationId !== user.organizationId
  )
    return res.status(403).json({ error: "FORBIDDEN" });

  let answer: Prisma.AnswerGetPayload<{
    include: {
      answerSelect: true;
      question: {
        include: { defaultAnswerSelectOptions: true; selectOptions: true };
      };
    };
  }>;

  try {
    answer = await prisma.answer.findUniqueOrThrow({
      where: { id: answerId as string },
      include: {
        answerSelect: true,
        question: {
          include: { defaultAnswerSelectOptions: true, selectOptions: true },
        },
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ message: "NOT_FOUND" });

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  switch (req.method) {
    case "GET":
      return res.status(200).json({ answer });

    case "POST":
      const answerUpdate = await prisma.answer
        .update({
          where: { id: answerId as string },
          data: {
            answerSelect: req.body.answerSelect,
            answerBool: req.body.answerBool,
            answerDate: new Date(req.body.answerDate),
            answerNum: req.body.answerNum,
            answerText: req.body.answerText,
            answerInt: req.body.answerInt,
            answerSelectOtherValues: req.body.answerSelectOtherValues,
          },
        })
        .catch((err) => console.log(err));

      if (!answerUpdate)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ answer: answerUpdate });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
