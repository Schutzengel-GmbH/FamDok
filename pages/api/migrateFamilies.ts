import { SessionRequest } from "supertokens-node/framework/express";
import { Request } from "express";
import supertokens from "supertokens-node/lib/build/supertokens";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import UserRoles from "supertokens-node/recipe/userroles";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import { logger as _logger } from "@/config/logger";
import { DataField, Education, MasterDataType, Prisma } from "@prisma/client";
import {
  FullDataField,
  FullFamily,
  FullMasterDataType,
} from "@/types/prismaHelperTypes";
import { differenceInYears } from "date-fns";
import comingFromOptionCard from "@/components/adminDashboard/comingFromOptionCard";
import { getEducationString, isHigherEducation } from "@/utils/utils";

supertokens.init(backendConfig());

export interface ICreateAdminUser {
  error?: "INTERNAL_SERVER_ERROR";
}

export default async function createAdminUser(
  req: SessionRequest & Request,
  res: any
) {
  const logger = _logger.child({
    endpoint: `/migrateFamilies`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
  });

  await superTokensNextWrapper(
    async (next) => {
      await verifySession({
        overrideGlobalClaimValidators: async function (globalClaimValidators) {
          return [
            ...globalClaimValidators,
            UserRoles.UserRoleClaim.validators.includes("admin"),
          ];
        },
      })(req, res, next);
    },
    req,
    res
  );

  logger.info({ session: req.session }, "access to /api/user/createAdminUser");

  const previousMDT = await prisma.masterDataType.findFirst({
    where: { name: "Familie" },
  });
  if (previousMDT)
    await prisma.masterDataType.delete({ where: { name: "Familie" } });

  const { useExistingComingFromOptions } = req.query;

  const surveyIdsWithFamily = (
    await prisma.survey.findMany({
      where: { hasFamily: true },
    })
  ).map((f) => ({ id: f.id }));

  const comingFromOptionsFromDb = await prisma.comingFromOption.findMany();

  const comingFromOptions =
    useExistingComingFromOptions?.toLowerCase() === "true" ||
    useExistingComingFromOptions === "1"
      ? comingFromOptionsFromDb.map((o) => ({ value: o.value }))
      : [
          { value: "Andere Hebamme", isOpen: false },
          { value: "Frauenhaus", isOpen: false },
          { value: "Jugendamt", isOpen: false },
          { value: "Klinik", isOpen: false },
          { value: "Selbst", isOpen: false },
          { value: "Anderes", isOpen: true },
        ];

  const dataFieldsInput: Prisma.DataFieldCreateInput[] = [
    {
      text: "Beginn der Betreuung",
      type: "Collection",
      collectionType: "Date",
      description:
        "Wann wurde die Familie aufgenommen. Mindestens ein Datum muss angegeben werden. Weitere Daten wenn eine beendete Betreuung wieder aufgenommen wird.",
      required: true,
    },
    {
      text: "Ende der Betreuung",
      type: "Collection",
      collectionType: "Date",
      description:
        "Wann wurde die Familie abgeschlossen. Weitere Daten wenn eine wieder aufgenommene Betreuung wieder abgeschlossen wird.",
      required: false,
    },
    {
      text: "Anzahl Kinder",
      type: "Int",
      description: "Wieviele Kinder sind in der Familie",
      required: false,
    },
    {
      text: "Kind(er) mit Behinderung",
      type: "Bool",
      description:
        "Ist in der Familie mindestens bei einem Kind eine Behinderung bekannt",
      required: false,
    },
    {
      text: "Kind(er) mit Psych. Diagnosen",
      type: "Bool",
      description:
        "Ist in der Familie mindestens bei einem Kind eine Psych. Diagnose bekannt",
      required: false,
    },
    {
      text: "Elternteil Minderjährig",
      type: "Bool",
      description:
        "War mindestens ein Elternteil zu Betreuungsbeginn minderjährig",
      required: false,
    },
    {
      text: "Elternteil mit Behinderung",
      type: "Bool",
      description:
        "Ist in der Familie mindestens bei einem Elternteil eine Behinderung bekannt",
      required: false,
    },
    {
      text: "Elternteil mit Psych. Diagnosen",
      type: "Bool",
      description:
        "Ist in der Familie mindestens bei einem Elternteil eine Psych. Diagnose bekannt",
      required: false,
    },
    {
      text: "Migrationshintergrund",
      type: "Bool",
      description: "Ist in der Familie ein Migrationshintergrund bekannt",
      required: false,
    },
    {
      text: "Höchster Bildungsabschluss",
      type: "Select",
      selectMultiple: false,
      selectOptions: {
        create: [
          { value: "Förderschulabschluss" },
          { value: "Hauptschulabschluss" },
          { value: "Realschulabschluss" },
          { value: "Fachhochschulreife" },
          { value: "Abitur" },
          { value: "Berufsausbildung" },
          { value: "Universitätsabschluss" },
          { value: "Keine" },
          { value: "Anderes", isOpen: true },
        ],
      },
    },
    {
      text: "Andere installierte Fachkräfte",
      type: "Text",
      description:
        "Welche anderen (externen) Fachkräfte sind aktuell in der Familie (z.B. Jugendamt o.ä.)",
      required: false,
    },
    {
      text: "Zugang über",
      type: "Select",
      description: "Worüber erfolgte der Zugang der Familie",
      selectMultiple: false,
      selectOptions: {
        create: comingFromOptions,
      },
    },
  ];

  const familyMDT = await prisma.masterDataType.create({
    data: {
      name: "Familie",
      Survey: { connect: surveyIdsWithFamily },
    },
  });

  for (const data of dataFieldsInput) {
    await prisma.masterDataType.update({
      where: { id: familyMDT.id },
      data: { dataFields: { create: data } },
    });
  }

  await prisma.survey.updateMany({
    where: { hasFamily: true },
    data: {
      hasFamily: false,
      hasMasterData: true,
      masterDataTypeId: familyMDT.id,
    },
  });

  const families = await prisma.family.findMany({
    include: {
      caregivers: true,
      children: true,
      comingFrom: true,
      createdBy: { include: { organization: true, subOrganizations: true } },
    },
  });

  const dataFields = (
    await prisma.masterDataType.findUnique({
      where: { id: familyMDT.id },
      include: { dataFields: { include: { selectOptions: true } } },
    })
  ).dataFields;

  for (const family of families) {
    const masterData = await prisma.masterData.create({
      data: {
        number: family.number,
        createdAt: family.createdAt,
        updatedAt: family.createdAt,
        createdBy: { connect: { id: family.userId } },
        masterDataType: { connect: { id: familyMDT.id } },
        answers: {
          create: dataFields.map((df) => getDataFieldAnswer(df, family)),
        },
      },
    });
  }

  return res.status(200).json({});
}

function getDataFieldAnswer(
  dataField: FullDataField,
  family: FullFamily
): Prisma.DataFieldAnswerCreateInput {
  const base: Prisma.DataFieldAnswerCreateInput = {
    dataField: { connect: { id: dataField.id } },
  };

  switch (dataField.text) {
    case "Beginn der Betreuung":
      return {
        ...base,
        answerCollection: {
          create: {
            type: "Date",
            collectionDataDate: {
              create: { value: new Date(family.beginOfCare) },
            },
          },
        },
      };
    case "Ende der Betreuung":
      return family.endOfCare
        ? {
            ...base,
            answerCollection: {
              create: {
                type: "Date",
                collectionDataDate: {
                  create: { value: new Date(family.endOfCare) },
                },
              },
            },
          }
        : { ...base };
    case "Anzahl Kinder":
      return {
        ...base,
        answerInt:
          Math.max(family.children.length, family.childrenInHousehold) ??
          undefined,
      };
    case "Kind(er) mit Behinderung":
      if (!family.children) return { ...base };
      let answerDisability = undefined;
      if (
        family.children.reduce(
          (prev, child) =>
            prev ||
            child.disability === "Yes" ||
            child.disability === "Impending",
          false
        )
      ) {
        answerDisability = true;
      } else if (
        family.children.reduce(
          (prev, child) => prev || child.disability === "No",
          false
        )
      ) {
        answerDisability = false;
      }
      return { ...base, answerBool: answerDisability };
    case "Kind(er) mit Psych. Diagnosen":
      if (!family.children) return { ...base };
      if (
        family.children.reduce(
          (prev, child) => prev || child.psychDiagosis,
          false
        )
      )
        return { ...base, answerBool: true };
      return { ...base };
    case "Elternteil Minderjährig":
      if (
        family.caregivers.findIndex(
          (c) => differenceInYears(family.beginOfCare, c.dateOfBirth) < 18
        )
      )
        return { ...base, answerBool: true };
      if (
        family.caregivers.reduce(
          (prev, caregiver) => prev || caregiver.dateOfBirth === undefined,
          false
        )
      )
        return undefined;
      return { ...base, answerBool: false };
    case "Elternteil mit Behinderung":
      if (!family.caregivers) return { ...base };
      let answerCaregiverDisability = undefined;
      if (
        family.caregivers.reduce(
          (prev, caregiver) =>
            prev ||
            caregiver.disability === "Yes" ||
            caregiver.disability === "Impending",
          false
        )
      ) {
        answerCaregiverDisability = true;
      } else if (
        family.caregivers.reduce(
          (prev, caregiver) => prev || caregiver.disability === "No",
          false
        )
      ) {
        answerCaregiverDisability = false;
      }
      return { ...base, answerBool: answerCaregiverDisability };
    case "Elternteil mit Psych. Diagnosen":
      if (!family.caregivers) return { ...base };
      if (
        family.caregivers.reduce(
          (prev, caregiver) => prev || caregiver.psychDiagosis,
          false
        )
      )
        return { ...base, answerBool: true };
      return { ...base };
    case "Migrationshintergrund":
      if (!family.caregivers) return { ...base };
      return {
        ...base,
        answerBool: family.caregivers.reduce(
          (prev, c) => prev || c.migrationBackground,
          false
        ),
      };
    case "Höchster Bildungsabschluss":
      const highestEducation = family.caregivers.reduce(
        (prev, c) =>
          isHigherEducation(prev, c.education) ? prev : c.education,
        Education.None
      );
      const string = getEducationString(highestEducation);

      const educationId =
        dataField.selectOptions.find((o) => o.value === string)?.id ??
        dataField.selectOptions.find((o) => o.value === "Anderes").id;

      if (!educationId) return { ...base };
      return { ...base, answerSelect: { connect: { id: educationId } } };
    case "Andere installierte Fachkräfte":
      return { ...base, answerText: family.otherInstalledProfessionals };
    case "Zugang über":
      const comingFromOptionId =
        dataField.selectOptions.find(
          (o) => o.value === family.comingFrom?.value
        )?.id ?? dataField.selectOptions.find((o) => o.value === "Anderes").id;
      if (!comingFromOptionId) return { ...base };
      return { ...base, answerSelect: { connect: { id: comingFromOptionId } } };
    default:
      return undefined;
  }
}

