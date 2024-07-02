import { QuestionType } from "@prisma/client";

export interface IFilter {
  name: string;
  filter: FilterType;
  questionId?: string;
  value?: any;
}

export interface IFamilyFilter {
  name: string;
  filter: FilterType;
  field: string;
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
  | "endsWith";

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
      filters = TextFilters;
      break;
    case "Bool":
      filters = BoolFilters;
      break;
    case "Int":
      filters = NumberFilters;
      break;
    case "Num":
      filters = NumberFilters;
      break;
    case "Select":
      filters = SelectFilters;
      break;
    case "Date":
      filters = DateFilters;
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

