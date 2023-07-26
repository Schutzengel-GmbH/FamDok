import { PartialAnswer } from "@/types/prismaHelperTypes";
import {
  Caregiver,
  Child,
  Family,
  Gender,
  Prisma,
  QuestionType,
} from "@prisma/client";
import { differenceInYears } from "date-fns";

export function getQuestionTypeString(type: QuestionType) {
  switch (type) {
    case QuestionType.Bool:
      return "Ja-Nein-Frage";
    case QuestionType.Int:
      return "Frage nach ganzer Zahl";
    case QuestionType.Num:
      return "Frage nach Dezimalzahl";
    case QuestionType.Text:
      return "Freitext-Frage";
    case QuestionType.Select:
      return "Auswahl-Frage";
    case QuestionType.Date:
      return "Frage nach Datum";
    case QuestionType.Scale:
      return "Skala";
    default:
      return type;
  }
}

export const getAge = (birthDate: Date) => {
  const today = new Date();
  const age = differenceInYears(today, new Date(birthDate));
  return Number.isNaN(age) ? undefined : age;
};

export function getGenderString(g: Gender) {
  switch (g) {
    case "Male":
      return "männlich";
    case "Female":
      return "weiblich";
    case "Other":
      return "anderes";
    case "Unknown":
      return "unbekannt";
  }
}

export function getAddFamilyInput(
  family: Partial<
    Family & { children: Partial<Child>[]; caregivers: Partial<Caregiver>[] }
  >,
  userId: string
): {
  familyCreate?: Prisma.FamilyCreateInput;
  error: boolean;
  errorMessage?: string;
} {
  if (!family.beginOfCare)
    return {
      error: true,
      errorMessage: "Betreuungsbeginn ist ein Pflichtfeld",
    };
  return {
    familyCreate: {
      ...family,
      beginOfCare: family.beginOfCare,
      caregivers: {
        createMany: {
          data:
            family.caregivers?.map((caregiver) => ({
              ...caregiver,
            })) || [],
        },
      },
      children: {
        createMany: {
          data:
            family.children?.map((child) => ({
              ...child,
            })) || [],
        },
      },
      createdBy: { connect: { id: userId } },
    },
    error: false,
  };
}

export function isInt(value: string) {
  return Number(value) == parseInt(value);
}

export function isFloat(value: string) {
  value = value.replace(",", ".");
  return Number(value) == parseFloat(value);
}

export function answerHasNoValues(answer: PartialAnswer) {
  const {
    answerSelect,
    answerBool,
    answerDate,
    answerInt,
    answerNum,
    answerText,
  } = answer;
  return (
    !answerBool &&
    !answerDate &&
    !answerInt &&
    !answerNum &&
    !answerText &&
    answerSelect &&
    answerSelect.length < 1
  );
}
