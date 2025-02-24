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
import { QuestionUpdateInput } from "@/components/editSurvey/editQuestion";

supertokens.init(backendConfig());

export interface IQuestion {
  question?: Prisma.QuestionGetPayload<{
    include: { selectOptions: true; defaultAnswerSelectOptions: true };
  }>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN"
    | "BAD_INPUT";
}

export default async function organizations(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}/questions/${req.query.question}`,
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

  const { survey: surveyId, question: questionId } = req.query;

  const user = await prisma.user
    .findUnique({
      where: { authId: req.session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const survey = await prisma.survey
    .findUnique({ where: { id: surveyId as string } })
    .catch((err) => logger.error(err));

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  let question: Prisma.QuestionGetPayload<{
    include: { selectOptions: true; defaultAnswerSelectOptions: true };
  }>;
  try {
    question = await prisma.question.findUniqueOrThrow({
      where: { id: questionId as string },
      include: { selectOptions: true, defaultAnswerSelectOptions: true },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ message: "NOT_FOUND" });

    logger.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  if (!question) return res.status(404).json({ message: "NOT_FOUND" });

  switch (req.method) {
    case "GET":
      return res.status(200).json({ question });

    case "POST":
      let questionUpdate;
      let deletion;
      const updateInput = req.body.updateInput as QuestionUpdateInput;

      if (updateInput.isDependent && !updateInput.dependencyTest)
        return res.status(400).json({ error: "BAD_INPUT" });

      if (user.role === Role.USER)
        return res.status(403).json({ error: "FORBIDDEN" });

      if (user.role === Role.ORGCONTROLLER)
        if (user.organizationId !== survey.organizationId)
          return res.status(403).json({ error: "FORBIDDEN" });

      try {
        const questionUpdateInput: Prisma.QuestionUpdateInput = {
          ...updateInput,
          selectOptions: undefined,
        };

        const newSelectOptions = updateInput.selectOptions;
        const oldSelectOptions = question.selectOptions;

        const selectOptionIdsToDelete = oldSelectOptions.filter(
          (s) => newSelectOptions.findIndex((ns) => ns.id === s.id) < 0
        );

        const selectOptionCreate = newSelectOptions.filter((ns) => !ns.id);

        const selectOptionsUpdate = newSelectOptions.filter((ns) => {
          const old = oldSelectOptions.find((os) => os.id === ns.id);

          for (const property in old) {
            if (ns[property] !== old[property]) return true;
          }
        });

        deletion = await prisma.selectOption.deleteMany({
          where: { id: { in: selectOptionIdsToDelete.map((s) => s.id) } },
        });

        const newOptions = await prisma.selectOption.createMany({
          data: selectOptionCreate.map((s) => ({
            value: s.value || "",
            questionId: questionId as string,
            ...s,
          })),
        });

        for (const updateInput of selectOptionsUpdate) {
          const update = await prisma.selectOption.update({
            where: { id: updateInput.id },
            data: updateInput,
          });
        }

        questionUpdate = await prisma.question.update({
          where: { id: questionId as string },
          data: questionUpdateInput,
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        });
      } catch (err) {
        // cannot throw not found, as we just looked for it

        logger.error(err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      return res.status(200).json({ question: questionUpdate, deletion });

    case "DELETE":
      let deletedQuestion;

      if (
        user.role === Role.USER ||
        (user.role === Role.ORGCONTROLLER &&
          user.organizationId !== survey.organizationId)
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      try {
        deletedQuestion = await prisma.question.delete({
          where: { id: questionId as string },
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        )
          return res.status(404).json({ message: "NOT_FOUND" });

        logger.error(err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      return res.status(200).json({ question: deletedQuestion });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

