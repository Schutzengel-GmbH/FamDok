import {
  FullDataField,
  FullFamily,
  IAnswerSelectOtherValues,
} from "@/types/prismaHelperTypes";
import { Education, Prisma, PrismaClient } from "@prisma/client";
import { differenceInYears } from "date-fns";

function getEducationString(e: Education) {
  switch (e) {
    case "None":
      return "Kein";
    case "Unknown":
      return "Unbekannt";
    case "Other":
      return "Andere";
    case "Foerderschulabschluss":
      return "Foerderschulabschluss";
    case "Hauptschulabschluss":
      return "Hauptschulabschluss";
    case "Realschulabschluss":
      return "Realschulabschluss";
    case "Fachhochschulreife":
      return "Fachhochschulreife";
    case "Abitur":
      return "Abitur";
    case "Berufsausbildung":
      return "Berufsausbildung";
    case "UniversityDegree":
      return "Hochschulabschluss";
    case "Higher":
      return "Höher";
  }
}

function isHigherEducation(ed: Education, comp: Education) {
  const sortedEducationArray: Education[] = [
    Education.None,
    Education.Unknown,
    Education.Other,
    Education.Foerderschulabschluss,
    Education.Hauptschulabschluss,
    Education.Realschulabschluss,
    Education.Fachhochschulreife,
    Education.Abitur,
    Education.UniversityDegree,
    Education.Higher,
  ];
  if (!ed) return true;
  else
    return (
      sortedEducationArray.indexOf(ed) > sortedEducationArray.indexOf(comp)
    );
}

const prisma = new PrismaClient();
async function main() {
  const previousMDT = await prisma.masterDataType.findFirst({
    where: { name: "Familie" },
  });
  if (previousMDT)
    await prisma.masterDataType.delete({ where: { name: "Familie" } });

  const comingFromOptionsFromDb = await prisma.comingFromOption.findMany();

  const useExistingComingFromOptions = comingFromOptionsFromDb.length > 0;

  const comingFromOptions = useExistingComingFromOptions
    ? comingFromOptionsFromDb.map((o) => ({ value: o.value }))
    : [
        { value: "Andere Hebamme", isOpen: false },
        { value: "Frauenhaus", isOpen: false },
        { value: "Jugendamt", isOpen: false },
        { value: "Klinik", isOpen: false },
        { value: "Selbst", isOpen: false },
        { value: "Anderes", isOpen: true },
      ];

  const locationOptions = await prisma.possibleLocation.findMany();

  const useLocationOptions = locationOptions.length > 0;

  const abschluss = await prisma.survey.findFirstOrThrow({
    where: { name: "Abschluss-Auswertung" },
  });

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
      type: "TriggerSurvey",
      triggerMultiple: true,
      triggeredSurvey: { connect: { id: abschluss.id } },
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
      type: "Select",
      selectMultiple: true,
      selectOptions: {
        create: [
          { value: "Familienhilfe/ Jugendamt/ ASD" },
          { value: "Hebamme" },
          { value: "Gesetzliche Betreuung" },
          { value: "Wohneinrichtung" },
          {
            value:
              "Sonstige Medizinische Fachkräfte (Ärzt*innen, Therapeut*innen, etc.)",
          },
          { value: "Sonstiges", isOpen: true },
        ],
      },
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
    {
      text: "Wohnort",
      type: useLocationOptions ? "Select" : "Text",
      description: "",
      selectMultiple: false,
      selectOptions: useLocationOptions
        ? {
            create: [
              ...locationOptions.map<Prisma.DataFieldSelectOptionCreateInput>(
                (l) => ({ value: l.name }),
              ),
              { value: "Anderes/Unbekannt" },
            ],
          }
        : undefined,
    },
  ];
  await prisma.masterDataType.deleteMany({ where: { name: "Familie" } });

  const familyMasterDataType = await prisma.masterDataType.create({
    data: {
      name: "Familie",
      dataFields: { create: dataFieldsInput },
    },
  });

  await prisma.survey.updateMany({
    where: { hasFamily: true },
    data: { hasMasterData: true, masterDataTypeId: familyMasterDataType.id },
  });

  // Migrate the family data

  const families = await prisma.family.findMany({
    include: {
      caregivers: true,
      children: true,
      comingFrom: true,
      createdBy: { include: { organization: true, subOrganizations: true } },
    },
  });

  const dataFields = await prisma.dataField.findMany({
    where: { masterDataTypeId: familyMasterDataType.id },
    include: { selectOptions: true, triggeredSurvey: true },
  });

  for (const family of families) {
    await prisma.masterData.create({
      data: {
        number: family.number,
        createdBy: { connect: { id: family.userId } },
        masterDataType: { connect: { id: familyMasterDataType.id } },
        answers: {
          create: dataFields
            .filter((d) => getDataFieldAnswer(d, family) !== undefined)
            .map((d) => getDataFieldAnswer(d, family)),
        },
      },
    });
  }

  // connect responses to MDT instead of family

  const responses = await prisma.response.findMany({
    where: { survey: { hasFamily: true } },
    include: { family: true },
  });

  for (const response of responses) {
    await prisma.response.update({
      where: { id: response.id },
      data: {
        masterData: {
          connect: response?.family
            ? { number: response.family.number }
            : undefined,
        },
      },
    });
  }

  // restart the number sequence
  const sorted = families.sort((a, b) =>
    a.number > b.number ? 1 : a.number < b.number ? -1 : 0,
  );
  const highest = sorted[sorted.length - 1].number;

  await prisma.$queryRawUnsafe(
    `ALTER SEQUENCE "MasterData_number_seq" RESTART WITH ${highest + 1};`,
  );

  // Cleanup

  await prisma.survey.updateMany({
    where: { hasFamily: true },
    data: { hasFamily: false },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function getDataFieldAnswer(
  dataField: FullDataField,
  family: FullFamily,
): Prisma.DataFieldAnswerCreateInput {
  const base: Prisma.DataFieldAnswerCreateInput = {
    dataField: { connect: { id: dataField.id } },
  };

  switch (dataField.text) {
    case "Beginn der Betreuung":
      return family.beginOfCare
        ? {
            ...base,
            answerCollection: {
              create: {
                type: "Date",
                collectionDataDate: {
                  create: { value: new Date(family.beginOfCare) },
                },
              },
            },
          }
        : undefined;
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
        : undefined;
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
          false,
        )
      ) {
        answerDisability = true;
      } else if (
        family.children.reduce(
          (prev, child) => prev || child.disability === "No",
          false,
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
          false,
        )
      )
        return { ...base, answerBool: true };
      return { ...base };
    case "Elternteil Minderjährig":
      if (
        family.caregivers.findIndex(
          (c) => differenceInYears(family.beginOfCare, c.dateOfBirth) < 18,
        )
      )
        return { ...base, answerBool: true };
      if (
        family.caregivers.reduce(
          (prev, caregiver) => prev || caregiver.dateOfBirth === undefined,
          false,
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
          false,
        )
      ) {
        answerCaregiverDisability = true;
      } else if (
        family.caregivers.reduce(
          (prev, caregiver) => prev || caregiver.disability === "No",
          false,
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
          false,
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
          false,
        ),
      };
    case "Höchster Bildungsabschluss":
      const highestEducation = family.caregivers.reduce(
        (prev, c) =>
          isHigherEducation(prev, c.education) ? prev : c.education,
        Education.None,
      );
      const string = getEducationString(highestEducation);

      const educationId =
        dataField.selectOptions.find((o) => o.value === string)?.id ??
        dataField.selectOptions.find((o) => o.value === "Anderes").id;

      if (!educationId) return { ...base };
      return { ...base, answerSelect: { connect: { id: educationId } } };
    case "Andere installierte Fachkräfte":
      const otherOptionId = dataField.selectOptions.find(
        (v) => v.value === "Sonstiges",
      ).id;
      console.log(dataField.selectOptions);
      return family.otherInstalledProfessionals
        ? {
            ...base,
            answerSelect: { connect: { id: otherOptionId } },
            selectOtherValues: [
              {
                selectOptionId: otherOptionId,
                value: family.otherInstalledProfessionals,
              },
            ] as IAnswerSelectOtherValues,
          }
        : { ...base };
    case "Zugang über":
      const comingFromOptionId =
        dataField.selectOptions.find(
          (o) => o.value === family.comingFrom?.value,
        )?.id ?? dataField.selectOptions.find((o) => o.value === "Anderes").id;
      if (!comingFromOptionId) return { ...base };
      return { ...base, answerSelect: { connect: { id: comingFromOptionId } } };
    case "Wohnort":
      if (dataField.type === "Text")
        return { ...base, answerText: family.location };
      else {
        const locationOptionId =
          dataField.selectOptions.find((o) => o.value === family.location)
            ?.id ??
          dataField.selectOptions.find((o) => o.value === "Anderes/Unbekannt")
            .id;
        if (!locationOptionId) return { ...base };
        return { ...base, answerSelect: { connect: { id: locationOptionId } } };
      }
    default:
      return undefined;
  }
}
