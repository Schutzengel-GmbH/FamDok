import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "express";
import { backendConfig } from "@/config/backendConfig";
import supertokens from "supertokens-node/lib/build/supertokens";
import { prisma } from "@/db/prisma";
import { logger } from "@/config/logger";
import { FooterPage, Prisma } from "@prisma/client";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import Session from "supertokens-node/recipe/session";
import { SessionRequest } from "supertokens-node/framework/express";
import { isUriLegal } from "@/utils/validationUtils";

supertokens.init(backendConfig());

export interface IFooters {
  footerPages?: Partial<FooterPage>[];
  page?: FooterPage;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "FORBIDDEN"
    | "METHOD_NOT_ALLOWED"
    | "ILLEGAL_URI";
}

export default async function footerPages(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const { getPageInfoOnly } = req.query as {
    getPageInfoOnly: string;
  };

  let session = await superTokensNextWrapper(
    async (next) => {
      return await Session.getSession(req, res, { sessionRequired: false });
    },
    req,
    res
  );

  let user = undefined;
  if (session)
    user = await prisma.user
      .findUnique({
        where: { authId: session.getUserId() },
      })
      .catch((err) =>
        logger.error(err, "error getting user on /footer/[id].tsx")
      );

  switch (req.method) {
    case "GET":
      const footerPages = await prisma.footerPage.findMany({
        select: getPageInfoOnly ? { uri: true, title: true } : undefined,
      });
      return res.status(200).json({ footerPages });
    case "POST":
      if (!user || user.role !== "ADMIN")
        return res.status(403).json({ error: "FORBIDDEN" });
      else {
        if (!isUriLegal(req.body.uri))
          return res.status(422).json({ error: "ILLEGAL_URI" });

        const newPage = await prisma.footerPage
          .create({
            data: req.body,
          })
          .catch((err) => logger.error(err, "error creating a footer page"));

        if (!newPage)
          return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        else return res.status(200).json({ page: newPage });
      }
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

