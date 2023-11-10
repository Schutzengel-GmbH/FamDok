import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { Caregiver, Child, Family, Prisma } from "@prisma/client";
import { FullFamily } from "@/types/prismaHelperTypes";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

export interface IFamily {
  family?: Prisma.FamilyGetPayload<{
    include: { caregivers: true; children: true; comingFrom: true };
  }>;
  error?:
    | "INTERNAL_SERVER_ERROR"
    | "METHOD_NOT_ALLOWED"
    | "NOT_FOUND"
    | "FORBIDDEN";
}

export interface IFamilyUpdate {
  familyUpdate?: Prisma.FamilyUpdateInput;
  childrenToUpdate?: Prisma.ChildUpdateInput[];
  caregiversToUpdate?: Prisma.CaregiverUpdateInput[];
  childrenToDelete?: Prisma.ChildWhereUniqueInput[];
  caregiverIdsToDelete?: Prisma.CaregiverWhereUniqueInput[];
  childrenToAdd?: Prisma.ChildCreateManyInput[];
  caregiversToAdd?: Prisma.CaregiverCreateManyInput[];
}

export default async function families(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/families/${req.query.family}`,
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

  let session = req.session;
  const user = await prisma.user
    .findUnique({
      where: { authId: session.getUserId() },
    })
    .catch((err) => logger.error(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  const { family: familyId } = req.query;

  let family: FullFamily;

  try {
    family = await prisma.family.findUniqueOrThrow({
      where: { id: familyId as string },
      include: { caregivers: true, children: true, comingFrom: true },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "NOT_FOUND" });

    logger.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  switch (req.method) {
    case "GET":
      return res.status(200).json({ family });
    case "POST":
      const update = req.body as IFamilyUpdate;

      if (user.role.includes("USER")) {
        if (family.userId !== user.id) {
          logger.warn(
            `user ${user.id} tried to update family ${familyId} but got FORBIDDEN`
          );
          return res.status(403).json({ error: "FORBIDDEN" });
        }
      }

      if (update.childrenToDelete)
        await prisma.child
          .deleteMany({
            where: {
              OR: [
                { id: { in: update.childrenToDelete.map((u) => u.id) } },
                {
                  number: { in: update.childrenToDelete.map((u) => u.number) },
                },
              ],
            },
          })
          .catch((err) => logger.error(err));

      if (update.caregiverIdsToDelete)
        await prisma.caregiver
          .deleteMany({
            where: {
              OR: [
                { id: { in: update.caregiverIdsToDelete.map((u) => u.id) } },
                {
                  number: {
                    in: update.caregiverIdsToDelete.map((u) => u.number),
                  },
                },
              ],
            },
          })
          .catch((err) => logger.error(err));

      if (update.childrenToUpdate)
        for (let child of update.childrenToUpdate) {
          const id = child.id as string;

          delete child.createdAt;
          delete child.updatedAt;
          delete child.id;

          await prisma.child.update({
            where: { id },
            data: child,
          });
        }

      if (update.caregiversToUpdate)
        for (let caregiver of update.caregiversToUpdate) {
          const id = caregiver.id as string;

          delete caregiver.createdAt;
          delete caregiver.updatedAt;
          delete caregiver.id;

          await prisma.caregiver.update({
            where: { id },
            data: caregiver,
          });
        }

      if (update.childrenToAdd)
        await prisma.child
          .createMany({ data: update.childrenToAdd })
          .catch((err) => logger.error(err));

      if (update.caregiversToAdd)
        await prisma.caregiver
          .createMany({ data: update.caregiversToAdd })
          .catch((err) => logger.error(err));

      const updatedFamily = await prisma.family
        .update({
          where: { id: familyId as string },
          data: update.familyUpdate || {},
        })
        .catch((err) => logger.error(err));

      return res.status(200).json({ family: updatedFamily ?? family });

    case "DELETE":
      if (user.role.includes("USER")) {
        if (family.userId !== user.id) {
          logger.warn(
            `user ${user.id} tried to delete family ${familyId} but got FORBIDDEN`
          );
          return res.status(403).json({ error: "FORBIDDEN" });
        }
      }

      const deletedFamily = await prisma.family
        .delete({ where: { id: familyId as string } })
        .catch((err) => logger.error(err));

      return res.status(200).json({ family: deletedFamily });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
