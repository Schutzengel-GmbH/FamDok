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
import { FullResponse } from "@/types/prismaHelperTypes";

supertokens.init(backendConfig());

export interface IResponse {
  response?: FullResponse;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN";
}

export default async function response(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/surveys/${req.query.survey}/responses/${req.query.response}`,
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
  // if it comes here, it means that the session verification was successful
  const { survey: surveyId, response: responseId } = req.query;

  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const survey = await prisma.survey
    .findUnique({ where: { id: surveyId as string } })
    .catch((err) => logger.error(err));

  if (!survey) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  // we need to check if the user is allowed to access this survey
  if (
    (user.role === Role.USER || user.role === Role.ORGCONTROLLER) &&
    survey.organizationId &&
    user.organizationId !== survey.organizationId
  )
    return res.status(403).json({ error: "FORBIDDEN" });

  let response: Prisma.ResponseGetPayload<{
    include: {
      answers: {
        include: {
          answerSelect: true;
          question: { include: { selectOptions: true } };
        };
      };
      user: { include: { organization: true; subOrganizations: true } };
      family: {
        include: {
          caregivers: true;
          children: true;
          comingFrom: true;
          createdBy: {
            include: { organization: true; subOrganizations: true };
          };
        };
      };
      caregiver: true;
      child: true;
    };
  }>;

  try {
    response = await prisma.response.findUniqueOrThrow({
      where: { id: responseId as string },
      include: {
        answers: {
          include: {
            answerSelect: true,
            question: { include: { selectOptions: true } },
          },
        },
        user: { include: { organization: true, subOrganizations: true } },
        family: {
          include: {
            caregivers: true,
            children: true,
            comingFrom: true,
            createdBy: {
              include: { organization: true, subOrganizations: true },
            },
          },
        },
        caregiver: true,
        child: true,
      },
    });

    if (response.surveyId !== surveyId)
      return res.status(404).json({ error: "NOT_FOUND" });

    if (user.role === Role.USER && response.userId !== user.id)
      return res.status(403).json({ error: "FORBIDDEN" });

    if (
      user.role === Role.ORGCONTROLLER &&
      response.user?.organizationId !== user.organizationId
    )
      return res.status(403).json({ error: "FORBIDDEN" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ message: "NOT_FOUND" });

    logger.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  switch (req.method) {
    case "GET":
      return res.status(200).json({ response });

    case "POST":
      const responseUpdate = await prisma.response
        .update({
          data: {
            name: req.body.name,
            family: req.body.family?.id
              ? { connect: { id: req.body.family.id } }
              : { disconnect: true },
            caregiver: req.body.caregiver?.id
              ? { connect: { id: req.body.caregiver.id } }
              : { disconnect: true },
            child: req.body.child?.id
              ? { connect: { id: req.body.child.id } }
              : { disconnect: true },
            answers: req.body.answers,
          },
          where: { id: responseId as string },
        })
        .catch((err) => logger.error(err));

      if (!responseUpdate)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ response: responseUpdate });

    case "DELETE":
      const responseDelete = await prisma.response
        .delete({ where: { id: responseId as string } })
        .catch((err) => logger.error(err));

      if (!responseDelete)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ response: responseDelete });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
