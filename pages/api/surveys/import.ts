import { Prisma, Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { prisma } from "@/db/prisma";
import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { Response } from "express";

supertokens.init(backendConfig());

export interface IImportSurvey {
  error?: "INTERNAL_SERVER_ERROR" | "METHOD_NOT_ALLOWED";
}

export default async function importSurvey(
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
  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  if (req.method !== "POST")
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  // if the user is USER or ORGCONTROLLER, we need to filter the surveys
  let organizationId = undefined;
  if (user.role === Role.USER || user.role === Role.ORGCONTROLLER)
    organizationId = user.organizationId;

  const surveyInput = req.body as Prisma.SurveyCreateInput;

  const questionCreateInputs = surveyInput.questions?.createMany
    ?.data as Prisma.QuestionCreateInput[];
  delete surveyInput.questions;

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
      },
    })
    .catch((err) => console.log(err));

  if (!newSurvey)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  for (const question of questionCreateInputs) {
    const q = await prisma.question.create({
      data: { ...question, survey: { connect: { id: newSurvey.id } } },
    });
    console.log(q);
    if (!q) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  return res.status(200).json({});
}
