import { FullQuestion } from "@/types/prismaHelperTypes";
import { SelectOption } from "@prisma/client";

export type ResponseFilter<F extends FilterType> = {
  question?: FullQuestion;
  filter?: F;
  filterFamily?: boolean;
  familyId?: string;
};

export type FilterType =
  | TextFilter
  | BoolFilter
  | NumberFilter
  | DateFilter
  | SelectFilter;

export type TextFilter = {
  filterText: string;
  caseSensitive: boolean;
  onlyFullMatch: boolean;
};

export type BoolFilter = {
  filterBool: boolean;
};

export type NumberFilter = {
  filterValue?: number;
  filterMax?: number;
  filterMin?: number;
};

export type DateFilter = {
  match?: Date;
  laterThan?: Date;
  earlierThan?: Date;
};

export type SelectFilter = {
  anyOf?: SelectOption[];
  exactMatch?: SelectOption[];
  not?: SelectOption[];
};

