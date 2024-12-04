import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { CollectionType, Prisma, Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Response } from "express";
import { PartialAnswer } from "@/types/prismaHelperTypes";
import { logger as _logger } from "@/config/logger";
import { tr } from "date-fns/locale";

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
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}/responses/${req.query.response}/submitAnswers`,
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

  const { survey: surveyId, response: responseId } = req.query;

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
      return res.status(404).json({ error: "SURVEY_NOT_FOUND" });

    logger.error(err);
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
      include: {
        answers: {
          include: {
            question: true,
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
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "RESPONSE_NOT_FOUND" });

    logger.error(err);
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
          //@ts-ignore
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

      if (answer.answerCollection) {
        const currentAnswer = response.answers?.find((a) => a.id === answer.id);

        const collectionDataField = () => {
          switch (currentAnswer.question.collectionType) {
            case "Text":
              return "collectionDataString";
            case "Int":
              return "collectionDataInt";
            case "Num":
              return "collectionDataFloat";
            case "Date":
              return "collectionDataDate";
          }
        };

        const collectionDataToDelete = currentAnswer?.answerCollection[
          collectionDataField()
        ].filter(
          (d) =>
            answer.answerCollection[collectionDataField()].find(
              (v) => v.id === d.id
            ) === undefined
        );

        //@ts-ignore it's fine...
        const del = await prisma[collectionDataField()].deleteMany({
          where: { id: { in: collectionDataToDelete.map((v) => v.id) } },
        });

        const collectionDataToUpdate = [];
        const collectionDataToAdd = answer.answerCollection[
          collectionDataField()
        ].filter((d) => d.id === undefined);

        //@ts-ignore it's fine...
        const add = await prisma[collectionDataField()].createMany({
          data: collectionDataToAdd,
        });
      }
    } else {
      result = await prisma.answer.create({
        data: {
          answerBool: answer.answerBool,
          //@ts-ignore
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
          //@ts-ignore
          answerCollection: answer.answerCollection
            ? {
                create: {
                  type: answer.answerCollection.type,
                  collectionDataDate: answer.answerCollection.collectionDataDate
                    ? {
                        createMany: {
                          data: answer.answerCollection.collectionDataDate,
                        },
                      }
                    : undefined,
                  collectionDataFloat: answer.answerCollection
                    .collectionDataFloat
                    ? {
                        createMany: {
                          data: answer.answerCollection.collectionDataFloat,
                        },
                      }
                    : undefined,
                  collectionDataInt: answer.answerCollection.collectionDataInt
                    ? {
                        createMany: {
                          data: answer.answerCollection.collectionDataInt,
                        },
                      }
                    : undefined,
                  collectionDataString: answer.answerCollection
                    .collectionDataString
                    ? {
                        createMany: {
                          data: answer.answerCollection.collectionDataString,
                        },
                      }
                    : undefined,
                },
              }
            : undefined,
        },
      });
    }
  }

  if (errors?.length > 0)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  else return res.status(200).json({});
}

