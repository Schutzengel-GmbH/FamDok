import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { backendConfig } from "@/config/backendConfig";
import supertokens from "supertokens-node/lib/build/supertokens";
import { prisma } from "@/db/prisma";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import Session from "supertokens-node/recipe/session";
import { logger } from "@/config/logger";
import { FooterPage } from "@prisma/client";

supertokens.init(backendConfig());

export interface IFooter {
  footerPage?: FooterPage;
  error?: "INTERNAL_SERVER_ERROR" | "FORBIDDEN" | "METHOD_NOT_ALLOWED";
}

export default async function footerPage(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const { id: uri } = req.query;

  let session = await superTokensNextWrapper(
    async (next) => {
      return await Session.getSession(req, res);
    },
    req,
    res
  );

  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) =>
      logger.error(err, "error getting user on /footer/[id].tsx")
    );

  switch (req.method) {
    case "GET":
      const footerPage = await prisma.footerPage.findUnique({
        where: { uri: uri as string },
      });
      res.status(200).json({ footerPage });
    case "POST":
      if (!user || user.role !== "ADMIN")
        return res.status(403).json({ error: "FORBIDDEN" });
      else {
        const updatedPage = await prisma.footerPage
          .update({
            where: { uri: uri as string },
            data: req.body,
          })
          .catch((err) => logger.error(err, "error updating a footer page"));

        if (!updatedPage)
          return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        else return res.status(200).json({});
      }
    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}

