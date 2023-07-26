import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Prisma, Role } from "@prisma/client";

supertokens.init(backendConfig());

export interface IQuestion {
  question?: Prisma.QuestionGetPayload<{
    include: { selectOptions: true; defaultAnswerSelectOptions: true };
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

  const { survey: surveyId, question: questionId } = req.query;

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

  switch (req.method) {
    case "GET":
      let question;
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

        console.error(err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      if (!question) return res.status(404).json({ message: "NOT_FOUND" });

      return res.status(200).json({ question });

    case "POST":
      let questionUpdate;
      const updateInput = req.body as Prisma.QuestionUpdateInput;

      // we have to delete all the selectOptions that are no longer required before new ones are added.
      let questionToUpdate: Prisma.QuestionGetPayload<{
        include: { selectOptions: true; defaultAnswerSelectOptions: true };
      }>;

      try {
        questionToUpdate = await prisma.question.findUnique({
          where: { id: questionId as string },
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        });

        const idsToKeep: string[] =
          // @ts-ignore
          updateInput.selectOptions.connectOrCreate.map((x) => x.where.id);

        const idsToDel = questionToUpdate.selectOptions
          .map((o) => o.id)
          .filter((id) => !idsToKeep.includes(id));

        await prisma.selectOption.deleteMany({
          where: { id: { in: idsToDel } },
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

      if (
        user.role === Role.USER ||
        (user.role === Role.ORGCONTROLLER &&
          user.organizationId !== survey.organizationId)
      )
        return res.status(403).json({ error: "FORBIDDEN" });

      try {
        questionUpdate = await prisma.question.update({
          data: updateInput,
          where: { id: questionId as string },
          include: { selectOptions: true, defaultAnswerSelectOptions: true },
        });
      } catch (err) {
        // cannot throw not found, as we just looked for it

        console.error(err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      return res.status(200).json({ question: questionUpdate });

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

        console.error(err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      }

      return res.status(200).json({ question: deletedQuestion });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
