import {
  FullAnswer,
  FullCollection,
  FullDataFieldAnswer,
  FullFamily,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { getCollectionDataField } from "@/utils/masterDataUtils";
import {
  Caregiver,
  Child,
  Disability,
  Education,
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
    case QuestionType.Collection:
      return "Sammlung";
    default:
      return type;
  }
}

export const getAge = (birthDate: Date) => {
  if (!birthDate) return undefined;
  const today = new Date();
  const age = differenceInYears(today, new Date(birthDate));
  return Number.isNaN(age) ? undefined : age;
};

export function getBoolString(b: boolean | undefined | null) {
  switch (b) {
    case true:
      return "Ja";
    case false:
      return "Nein";
    case undefined:
    case null:
      return "Unbekannt/Keine Angabe";
  }
}

export function getDisabilityString(disability: Disability) {
  switch (disability) {
    case "Yes":
      return "Ja";
    case "No":
      return "Nein";
    case "Impending":
      return "Drohend";
    case "None":
      return "Keine Angabe";
    case "Unknown":
      return "Unbekannt";
  }
}

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

export function getEducationString(e: Education) {
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

export function isHigherEducation(ed: Education, comp: Education) {
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

  let comingFromOptionId = family.comingFromOptionId;
  delete family.comingFromOptionId;

  return {
    familyCreate: {
      ...family,
      beginOfCare: family.beginOfCare,
      comingFrom: comingFromOptionId
        ? { connect: { id: comingFromOptionId } }
        : undefined,
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

export function dataFieldAnswerHasNoValues(
  answer: RecursivePartial<FullDataFieldAnswer>
) {
  if (!answer) return true;

  const {
    answerSelect,
    answerBool,
    answerDate,
    answerInt,
    answerNum,
    answerText,
    answerCollection,
  } = answer;

  return (
    !(answerBool === true || answerBool === false) &&
    !answerDate &&
    ((!answerInt && answerInt !== 0) || isNaN(answerInt)) &&
    ((!answerNum && answerNum !== 0) || isNaN(answerNum)) &&
    !answerText &&
    (!answerSelect || answerSelect.length < 1) &&
    collectionHasNoAnswers(answerCollection)
  );
}

export function answerHasNoValues(answer: PartialAnswer) {
  if (!answer) return true;

  const {
    answerSelect,
    answerBool,
    answerDate,
    answerInt,
    answerNum,
    answerText,
    answerCollection,
  } = answer;

  return (
    !(answerBool === true || answerBool === false) &&
    !answerDate &&
    !answerInt &&
    answerInt !== 0 &&
    !answerNum &&
    answerNum !== 0 &&
    !answerText &&
    answerSelect &&
    answerSelect.length < 1 &&
    collectionHasNoAnswers(answerCollection)
  );
}

export function collectionHasNoAnswers(
  answerCollection: RecursivePartial<FullCollection>
) {
  if (!answerCollection) return true;
  const collectionDataField = getCollectionDataField(answerCollection.type);
  return (
    !answerCollection[collectionDataField] ||
    answerCollection[collectionDataField].length < 1
  );
}

export function exportBlob(blob, filename) {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
}

export function range(start: number, end: number) {
  let arr = new Array(end - start + 1).fill(undefined).map((_, i) => i + start);
  return arr;
}

export function getFamilyString(family: FullFamily) {
  return `Familiennummer: ${family.number} (${
    family.caregivers.length
  } Bezugspersonen, Kinder (${family.childrenInHousehold || "keine"})${
    family.children?.length > 0 ? ": " : ""
  }${family.children
    .map((c) => {
      if (!c.dateOfBirth) return "unbekanntes Alter";
      const age = getAge(new Date(c.dateOfBirth));
      return `${age} Jahre`;
    })
    .join(", ")})`;
}

export function makeUriLegal(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/[\s]/g, "-")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replaceAll(/[^a-zA-Z0-9-_]/g, "");
}

export function sortByStringProperty(propName: string) {
  return (
    object1: any & { [x: string]: string },
    object2: any & { [x: string]: string }
  ) => {
    if (!(propName in object1) || !(propName in object2))
      throw new Error(`Property ${propName} does not exist in object`);
    if (object1[propName] < object2[propName]) return -1;
    if (object1[propName] > object2[propName]) return 1;
    else return 0;
  };
}

export function sortByNumberProperty(propName: string) {
  return (
    object1: any & { [x: string]: number },
    object2: any & { [x: string]: number }
  ) => {
    if (!(propName in object1) || !(propName in object2))
      throw new Error(`Property ${propName} does not exist in object`);
    if (object1[propName] < object2[propName]) return -1;
    if (object1[propName] > object2[propName]) return 1;
    else return 0;
  };
}

export function sortAlphaByKey(key: string) {
  return (a: object, b: object) => {
    if (a[key] < b[key]) return -1;
    else if (a[key] > b[key]) return 1;
    else return 0;
  };
}

export function comparePrimitiveArrayByElements<T = number | string>(
  a: T[],
  b: T[]
) {
  try {
    return a?.sort().join() === b?.sort().join();
  } catch (e) {
    return false;
  }
}

export function getAnswerString(answer: FullAnswer): string | undefined {
  if (!answer || !answer.question) return undefined;
  switch (answer.question.type) {
    case "Text":
      return answer.answerText || undefined;
    case "Int":
      return answer.answerInt?.toString() || undefined;
    case "Num":
      return answer.answerNum?.toString() || undefined;
    case "Scale":
    case "Select":
      return answer.answerSelect.reduce((acc, a) => {
        if (acc)
          return `${acc}, ${
            a.isOpen
              ? (answer.answerSelectOtherValues as Array<any>).find(
                  (ao) => ao.selectOptionId === a.id
                ).value
              : a.value
          }`;
        else
          return `${
            a.isOpen
              ? (answer.answerSelectOtherValues as Array<any>).find(
                  (ao) => ao.selectOptionId === a.id
                ).value
              : a.value
          }`;
      }, "");
    case "Date":
      return answer.answerDate
        ? new Date(answer.answerDate).toLocaleDateString()
        : undefined;
    case "Bool":
      return answer.answerBool === true
        ? "Ja"
        : answer.answerBool === false
        ? "Nein"
        : undefined;
    default:
      return undefined;
  }
}

export type ApiError =
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "FORBIDDEN";
