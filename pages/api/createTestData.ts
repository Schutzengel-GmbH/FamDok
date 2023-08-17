import { Prisma, Gender, Disability, Education } from "@prisma/client";
import supertokens from "supertokens-node/lib/build/supertokens";
import { backendConfig } from "@/config/backendConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Response } from "express";
import { prisma } from "@/db/prisma";
import { logger as _logger } from "@/config/logger";

supertokens.init(backendConfig());

export default async function createTestData(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/createTestData`,
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

  logger.info("someone accessed /api/createTestData");

  // remove this line to enable this endpoint
  return res.json({ message: "Endpoint disabled" });
  logger.info("creating random family  data for testing...");

  const userAuthId = req.session.getUserId();
  const user = await prisma.user.findUnique({ where: { authId: userAuthId } });
  if (!user) return res.status(500).json({ error: "User not found" });

  const n = 1500;

  for (let i = 0; i < n; i++) {
    const twoParents = (Math.random() < 0.5) as Boolean;
    const caregivers: Prisma.CaregiverCreateManyFamilyInputEnvelope = twoParents
      ? {
          data: {
            gender: randomSelect([
              Gender.Female,
              Gender.Male,
              Gender.Other,
              Gender.Unknown,
            ]),
            dateOfBirth: randomBirthdateParent(),
            disability: randomSelect([
              Disability.Yes,
              Disability.No,
              Disability.Unknown,
              Disability.None,
            ]),
            education: randomSelect([
              Education.Abitur,
              Education.Fachhochschulreife,
              Education.Realschulabschluss,
              Education.Hauptschulabschluss,
              Education.Other,
              Education.Unknown,
              Education.None,
              Education.Berufsausbildung,
              Education.UniversityDegree,
            ]),
            psychDiagosis: randomSelect([true, false, null, undefined]),
            migrationBackground: randomSelect([true, false, null, undefined]),
          },
        }
      : {
          data: [
            {
              gender: randomSelect([
                Gender.Female,
                Gender.Male,
                Gender.Other,
                Gender.Unknown,
              ]),
              dateOfBirth: randomBirthdateParent(),
              disability: randomSelect([
                Disability.Yes,
                Disability.No,
                Disability.Unknown,
                Disability.None,
              ]),
              education: randomSelect([
                Education.Abitur,
                Education.Fachhochschulreife,
                Education.Realschulabschluss,
                Education.Hauptschulabschluss,
                Education.Other,
                Education.Unknown,
                Education.None,
                Education.Berufsausbildung,
                Education.UniversityDegree,
              ]),
              psychDiagosis: randomSelect([true, false, null, undefined]),
              migrationBackground: randomSelect([true, false, null, undefined]),
            },
            {
              gender: randomSelect([
                Gender.Female,
                Gender.Male,
                Gender.Other,
                Gender.Unknown,
              ]),
              dateOfBirth: randomBirthdateParent(),
              disability: randomSelect([
                Disability.Yes,
                Disability.No,
                Disability.Unknown,
                Disability.None,
              ]),
              education: randomSelect([
                Education.Abitur,
                Education.Fachhochschulreife,
                Education.Realschulabschluss,
                Education.Hauptschulabschluss,
                Education.Other,
                Education.Unknown,
                Education.None,
                Education.Berufsausbildung,
                Education.UniversityDegree,
              ]),
              psychDiagosis: randomSelect([true, false, null, undefined]),
              migrationBackground: randomSelect([true, false, null, undefined]),
            },
          ],
        };
    const nOfChildren = Math.floor(Math.random() * 5) + 1;

    let childrenData: Prisma.ChildCreateManyFamilyInput[] = [];
    for (let j = 0; j < nOfChildren; j++) {
      childrenData.push({
        gender: randomSelect([
          Gender.Female,
          Gender.Male,
          Gender.Other,
          Gender.Unknown,
        ]),
        dateOfBirth: randomBirthdateKid(),
        disability: randomSelect([
          Disability.Yes,
          Disability.No,
          Disability.Unknown,
          Disability.None,
        ]),
        psychDiagosis: randomSelect([true, false, null, undefined]),
        isMultiple: randomSelect([true, false, null, undefined]),
      });
    }

    await prisma.family
      .create({
        data: {
          beginOfCare: randomStartOfCareDate(),
          endOfCare: randomSelect([randomEndOfCareDate(), null]),
          location: randomSelect([
            "Flensburg",
            "Kiel",
            "Hamburg",
            "Lübeck",
            "Berlin",
            "",
          ]),
          createdBy: { connect: { id: user.id } },
          caregivers: { createMany: caregivers },
          children: { createMany: { data: childrenData } },
          childrenInHousehold: Math.floor(Math.random() * 10) + 1,
          otherInstalledProfessionals: randomSelect([
            "",
            "Jugendamt",
            "ASD",
            "Hebamme",
          ]),
        },
      })
      .catch((err) => logger.error(err));
  }

  return res.status(200).json({ message: "Success" });
}

function randomSelect(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBirthdateKid() {
  const start = new Date(2020, 0, 1);
  const end = new Date(2023, 0, 1);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomBirthdateParent() {
  const start = new Date(1960, 0, 1);
  const end = new Date(2006, 0, 1);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomStartOfCareDate() {
  const start = new Date(2017, 0, 1);
  const end = new Date(2022, 6, 1);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomEndOfCareDate() {
  const start = new Date(2022, 6, 2);
  const end = new Date(2023, 6, 13);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export async function yeetData() {
  return await prisma.family.deleteMany({});
}
