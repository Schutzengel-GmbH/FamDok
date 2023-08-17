import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node/lib/build/supertokens";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { Response } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { logger as _logger, logger } from "@/config/logger";
import { prisma } from "@/db/prisma";
import { LogEntry, Role } from "@prisma/client";
import { sub } from "date-fns";

supertokens.init(backendConfig());

export interface ILogs {
  error?: "FORBIDDEN";
  logs?: LogEntry[];
}

export default async function getLogs(
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

  const user = await prisma.user.findUnique({
    where: { authId: req.session.getUserId() },
  });
  if (!user || user.role !== Role.ADMIN)
    return res.status(403).json({ error: "FORBIDDEN" });

  const { level, from, til } = req.query as {
    level: string;
    from: string;
    til: string;
  };

  let fromDate: Date;
  let tilDate: Date;

  let fromTimestamp = Date.parse(from);
  if (isNaN(fromTimestamp)) fromDate = sub(new Date(Date.now()), { days: 1 });
  else fromDate = new Date(fromTimestamp);

  let tilTimestamp = Date.parse(til);
  if (isNaN(tilTimestamp)) tilDate = new Date(Date.now());
  else tilDate = new Date(tilTimestamp);

  const logs = await prisma.logEntry.findMany({
    where: {
      level: { gte: parseInt(level) ?? 40 },
      AND: [{ time: { gte: fromDate } }, { time: { lte: tilDate } }],
    },
  });

  res.status(200).json({ logs });
}
