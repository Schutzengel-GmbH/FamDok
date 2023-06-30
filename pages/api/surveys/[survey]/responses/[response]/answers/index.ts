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

export interface IAnswers {
  answers?: Prisma.AnswerGetPayload<{
    include: {
      answerSelect: true;
      question: {
        include: {
          defaultAnswerSelectOptions: true;
          selectOptions: true;
        };
      };
    };
  }>[];
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
    | "UNAUTHORIZED";
}

export default async function answers(
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
  // if it comes here, it means that the session verification was successful
  const { survey: surveyId, response: responseId } = req.query;

  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const survey = await prisma.survey
    .findUnique({ where: { id: surveyId as string } })
    .catch((err) => console.log(err));

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  // we need to check if the user is allowed to access this survey
  if (
    (user.role === Role.USER || user.role === Role.ORGCONTROLLER) &&
    survey.organizationId &&
    user.organizationId !== survey.organizationId
  )
    return res.status(403).json({ error: "UNAUTHORIZED" });

  let response: Prisma.ResponseGetPayload<{
    include: {
      answers: {
        include: {
          answerSelect: true;
          question: {
            include: {
              selectOptions: true;
              defaultAnswerSelectOptions: true;
            };
          };
        };
      };
      user: true;
    };
  }>;

  try {
    response = await prisma.response.findUniqueOrThrow({
      where: { id: responseId as string },
      include: {
        answers: {
          include: {
            answerSelect: true,
            question: {
              include: {
                selectOptions: true,
                defaultAnswerSelectOptions: true,
              },
            },
          },
        },
        user: true,
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

  if (user.role === Role.USER && response.userId !== user.id)
    return res.status(403).json({ error: "UNAUTHORIZED" });

  if (
    user.role === Role.ORGCONTROLLER &&
    response.user.organizationId !== user.organizationId
  )
    return res.status(403).json({ error: "UNAUTHORIZED" });

  switch (req.method) {
    case "GET":
      return res.status(200).json({ answers: response?.answers });

    case "POST":
      const newAnswer = await prisma.answer
        .create({
          data: {
            answerSelect: req.body.answerSelect,
            answerBool: req.body.answerBool,
            answerDate: new Date(req.body.answerDate),
            answerNum: req.body.answerNum,
            answerText: req.body.answerText,
            answerInt: req.body.answerInt,
            answerSelectOtherValues: req.body.answerSelectOtherValues,
            question: { connect: { id: req.body.questionId } },
            response: { connect: { id: responseId as string } },
          },
          include: {
            answerSelect: true,
            question: {
              include: {
                defaultAnswerSelectOptions: true,
                selectOptions: true,
              },
            },
          },
        })
        .catch((err) => console.log(err));

      if (!newAnswer)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ answer: newAnswer });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
