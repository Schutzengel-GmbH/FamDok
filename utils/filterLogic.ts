import { SelectOption } from "@prisma/client"
import { isAfter, isBefore, isSameDay, isWithinInterval } from "date-fns"

export interface IFilter<TValue, TParams = undefined> {
  name: string,
  text: string,
  fnc: (value: TValue, params: TParams) => boolean
}

export const AllFilters: IFilter<any>[] = [
  {
    name: "hasValue",
    text: "Wert vorhanden",
    fnc: (value) => value
  },
  {
    name: "noValue",
    text: "Keine Angabe",
    fnc: (value) => !value
  }
]

export type DateFilter = IFilter<Date, { compareDate: Date } | { start: Date, end: Date }>

export const DateFilters: DateFilter[] = [
  {
    name: "sameDay",
    text: "Am",
    fnc: (value: Date, params: { compareDate: Date }) => isSameDay(value, params.compareDate)
  },
  {
    name: "before",
    text: "Vor",
    fnc: (value: Date, params: { compareDate: Date }) => isBefore(value, params.compareDate)
  },
  {
    name: "after",
    text: "Nach",
    fnc: (value: Date, params: { compareDate: Date }) => isAfter(value, params.compareDate)
  },
  {
    name: "range",
    text: "Zwischen",
    fnc: (value, params: { start: Date, end: Date }) => isWithinInterval(value, params)
  }
]

export type TextFilter = IFilter<string, { compareString: string }>;

export const TextFilters: TextFilter[] = [
  {
    name: "stringEqual",
    text: "Exakt gleich",
    fnc: (value, params) => value === params.compareString
  },
  {
    name: "like",
    text: "Enthält",
    fnc: (value, params) => value.toLowerCase().includes(params.compareString.toLowerCase())
  }
]

export type NumberFilter = IFilter<number, { compareNumber: number }>

export const NumberFilters: NumberFilter[] = [
  {
    name: "equals",
    text: "Ist Gleich",
    fnc: (value, params) => value === params.compareNumber
  },
  {
    name: "gt",
    text: "Größer als",
    fnc: (value, params) => value > params.compareNumber
  },
  {
    name: "gte",
    text: "Größer oder gleich",
    fnc: (value, params) => value >= params.compareNumber
  },
  {
    name: "lt",
    text: "Kleiner als",
    fnc: (value, params) => value < params.compareNumber
  },
  {
    name: "lte",
    text: "Kleiner oder gleich",
    fnc: (value, params) => value <= params.compareNumber
  },
]

export type BooleanFilter = IFilter<boolean>

export const BooleanFilters: BooleanFilter[] = [
  {
    name: "true",
    text: "Ja/Wahr",
    fnc: (value) => value
  },
  {
    name: "false",
    text: "Nein/Unwahr",
    fnc: (value) => value === false
  }
]