import { FullSurvey } from "@/types/prismaHelperTypes";
import { Prisma, QuestionType } from "@prisma/client";

export interface IFilter {
  name?: string;
  filter?: FilterType;
  questionId?: string;
  value?: any;
}

export interface IFamilyFilter {
  name?: string;
  filter?: FilterType;
  field?: string;
  value?: any;
}

export type GeneralFilterFields =
  | "responseCreatedBy"
  | "responseCreatedAt"
  | "responseCreatedByOrg";

export interface IGeneralFilter {
  name?: string;
  filter?: FilterType;
  field?: GeneralFilterFields;
  value?: any;
}

export type FilterType =
  | "equals"
  | "contains"
  | "not"
  | "in"
  | "notIn"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "startsWith"
  | "endsWith"
  | "empty"
  | "notEmpty";

const NullFilters: IFilter[] = [
  { filter: "empty", name: "Hat keinen Wert", value: true },
  { filter: "notEmpty", name: "Hat Wert", value: true },
];

export const TextFilters: IFilter[] = [
  { filter: "equals", name: "Gleich" },
  { filter: "contains", name: "Enthält" },
  { filter: "endsWith", name: "Endet auf" },
  { filter: "startsWith", name: "Beginnt mit" },
];
export const BoolFilters: IFilter[] = [
  { filter: "equals", name: "Ja", value: true },
  { filter: "not", name: "Nein", value: true },
];
export const DateFilters: IFilter[] = [
  { filter: "gt", name: "Ist nach" },
  { filter: "gte", name: "Ist nach oder am" },
  { filter: "lt", name: "Ist vor" },
  { filter: "lte", name: "Ist vor oder am" },
  { filter: "equals", name: "Am" },
  { filter: "not", name: "Nicht am" },
];
export const NumberFilters: IFilter[] = [
  { filter: "gt", name: "Größer als" },
  { filter: "gte", name: "Größer oder gleich" },
  { filter: "lt", name: "Kleiner als" },
  { filter: "lte", name: "Kleiner oder gleich" },
  { filter: "equals", name: "Ist gleich" },
  { filter: "not", name: "Ist nicht gleich" },
];
export const SelectFilters: IFilter[] = [
  { filter: "in", name: "Enthält mindestens einen von" },
];
export const ScaleFilters: IFilter[] = [
  { filter: "in", name: "Innerhalb des Intervalls" },
  { filter: "notIn", name: "Außerhalb des Intervalls" },
];

export function getFiltersForQuestionType(questionType: QuestionType) {
  let filters = [];

  switch (questionType) {
    case "Text":
      filters = [...NullFilters, ...TextFilters];
      break;
    case "Bool":
      filters = [...NullFilters, ...BoolFilters];
      break;
    case "Int":
      filters = [...NullFilters, ...NumberFilters];
      break;
    case "Num":
      filters = [...NullFilters, ...NumberFilters];
      break;
    case "Select":
      filters = SelectFilters;
      break;
    case "Date":
      filters = [...NullFilters, ...DateFilters];
      break;
    case "Scale":
      filters = ScaleFilters;
      break;
  }

  return filters;
}

export interface SelectFilterProps {
  questionType: QuestionType;
  filter: IFilter;
  onChange: (filter: IFilter, value?: any) => void;
}

export function getWhereInput(
  filter: IFilter,
  survey: FullSurvey
): Prisma.ResponseWhereInput {
  if (!filter?.questionId) return {};

  if (filter.value === null || filter.value === undefined) return {};

  const question = survey?.questions?.find((q) => q.id === filter?.questionId);

  let answerField: string;

  switch (question?.type) {
    case "Text":
      answerField = "answerText";
      break;
    case "Bool":
      answerField = "answerBool";
      break;
    case "Int":
      answerField = "answerInt";
      break;
    case "Num":
      answerField = "answerNum";
      break;
    case "Select":
      answerField = "answerSelect";
      break;
    case "Date":
      answerField = "answerDate";
      break;
    case "Scale":
      answerField = "answerSelect";
      break;
  }

  if (filter?.filter === "empty")
    return {
      answers: {
        some: {
          questionId: question?.id || undefined,

          [answerField]: {
            equals: null,
          },
        },
      },
    };

  if (filter?.filter === "notEmpty")
    return {
      answers: {
        some: {
          questionId: question?.id || undefined,
          [answerField]: {
            not: null,
          },
        },
      },
    };

  if (answerField === "answerSelect")
    return {
      answers: {
        some: {
          questionId: question?.id,
          answerSelect: {
            some: {
              id: { [filter.filter]: filter.value.map((o) => o.id) },
            },
          },
        },
      },
    };
  else
    return {
      answers: {
        some: {
          questionId: question?.id || undefined,
          [answerField]: filter
            ? {
                [filter.filter]: filter.value,
                mode: answerField === "answerText" ? "insensitive" : undefined,
              }
            : null,
        },
      },
    };
}

export function getGeneralWhereInput(
  generalFilter: IGeneralFilter
): Prisma.ResponseWhereInput {
  if (!generalFilter?.field) return {};

  switch (generalFilter.field) {
    case "responseCreatedBy":
      return {
        user: {
          id: {
            equals: generalFilter.value,
          },
        },
      };
    case "responseCreatedAt":
      return { createdAt: { [generalFilter.filter]: generalFilter.value } };
    case "responseCreatedByOrg":
      const org = generalFilter?.value?.organization;
      const subOrg = generalFilter?.value?.subOrganization;
      return {
        user: {
          organizationId: org?.id,
          subOrganizations: subOrg ? { some: { id: subOrg?.id } } : undefined,
        },
      };
    default:
      return {};
  }
}

