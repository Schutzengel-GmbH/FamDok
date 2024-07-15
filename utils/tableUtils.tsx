import { FamilyFields } from "@/components/surveyStats/familyFilterComponent";
import {
  FullFamily,
  FullResponse,
  FullSurvey,
  IAnswerSelectOtherValue,
} from "@/types/prismaHelperTypes";
import { IFamilyFilter } from "@/utils/filters";
import { getEducationString, isHigherEducation } from "@/utils/utils";
import { Prisma, QuestionType } from "@prisma/client";
import {
  compareAsc,
  compareDesc,
  differenceInYears,
  isSameDay,
} from "date-fns";
import { ColumnDefinition } from "react-tabulator";
import { Tabulator } from "react-tabulator/lib/types/TabulatorTypes";

type ResponseTableData = {
  [questionId: string]:
    | string
    | number
    | boolean
    | Date
    | { [selectOptionId: string]: string | boolean }
    | undefined;
  // family data
} & FamilyTableData;

type FamilyTableData = {
  familyNumber?: number;
  beginOfCare?: Date;
  childrenInHousehold?: number;
  location?: string;
  childrenWithDisability?: boolean;
  careGiverWithDisability?: boolean;
  childWithPsychDiagnosis?: boolean;
  caregiverWithPsychDiagnosis?: boolean;
  migrationBackground?: boolean;
  highestEducation?: string;
  otherInstalledProfessionals?: string;
  comingFrom?: string;
  endOfCare?: Date;
};

export function responsesToAllAnswersTable(
  responses: FullResponse[]
): ResponseTableData[] {
  let result: ResponseTableData[] = [];

  if (!responses) return result;

  for (const response of responses) {
    let data: ResponseTableData = {};

    data["id"] = response.id;
    data["surveyId"] = response.surveyId;

    for (const answer of response.answers) {
      if (answer.question.type === QuestionType.Select)
        data[answer.question.id] = answer.answerSelect.reduce<{
          [id: string]: string | boolean;
        }>((acc, s) => {
          if (s.isOpen)
            return {
              ...acc,
              [s.id]: (
                answer.answerSelectOtherValues as IAnswerSelectOtherValue[]
              ).find((ov) => ov.selectOptionId === s.id).value,
            };
          else return { ...acc, [s.id]: true };
        }, {});
      else {
        switch (answer.question.type) {
          case QuestionType.Date:
            data[answer.question.id] = answer.answerDate
              ? new Date(answer.answerDate)
              : undefined;
            break;
          case QuestionType.Int:
            data[answer.question.id] = answer.answerInt ?? undefined;
            break;
          case QuestionType.Num:
            data[answer.question.id] = answer.answerNum ?? undefined;
            break;
          case QuestionType.Bool:
            data[answer.question.id] = answer.answerBool ?? undefined;
            break;
          case QuestionType.Text:
            data[answer.question.id] = answer.answerText;
            break;
          case QuestionType.Scale:
            data[answer.question.id] =
              answer.answerSelect[0]?.value ?? undefined;
            break;
        }
      }
    }
    if (response.family) {
      data = { ...data, ...getFamilyData(response.family) };
    }
    result.push(data);
  }

  return result;
}

export function getFamilyData(family: FullFamily): FamilyTableData {
  let data = {};
  data["familyNumber"] = family.number;
  data["beginOfCare"] = family.beginOfCare
    ? new Date(family.beginOfCare)
    : undefined;
  data["childrenInHousehold"] = family.childrenInHousehold;
  data["location"] = family.location;
  data["childrenWithDisability"] = family.children?.reduce<boolean>(
    (b, ch) =>
      ch.disability === "Yes" || ch.disability === "Impending" ? (b = true) : b,
    false
  );
  data["careGiverWithDisability"] = family.caregivers?.reduce<boolean>(
    (b, c) =>
      c.disability === "Yes" || c.disability === "Impending" ? (b = true) : b,
    false
  );
  data["childWithPsychDiagnosis"] = family.children?.reduce<boolean>(
    (b, ch) => (ch.psychDiagosis === true ? (b = true) : b),
    false
  );
  data["caregiverWithPsychDiagnosis"] = family.caregivers?.reduce<boolean>(
    (b, c) => (c.psychDiagosis === true ? (b = true) : b),
    false
  );
  data["migrationBackground"] = family.caregivers?.reduce<boolean>(
    (b, c) => (c.migrationBackground === true ? (b = true) : b),
    false
  );
  data["highestEducation"] = family.caregivers?.reduce(
    (prev, c, i, caregivers) => {
      if (i === 0) return getEducationString(c.education);
      else if (isHigherEducation(c.education, caregivers[i - 1].education))
        return getEducationString(c.education);
      else return prev;
    },
    ""
  );
  data["otherInstalledProfessionals"] = family.otherInstalledProfessionals;
  data["comingFrom"] = family.comingFrom?.value || undefined;
  data["endOfCare"] = family.endOfCare ? new Date(family.endOfCare) : undefined;

  data["underage"] = underageCaregiverAtBegin(family);

  data["createdBy"] = family.createdBy?.name || family.createdBy?.email || "";

  return data;
}

function underageCaregiverAtBegin(family: FullFamily): boolean {
  for (const caregiver of family.caregivers) {
    if (!caregiver.dateOfBirth) break;
    const ageAtStart = differenceInYears(
      new Date(family.beginOfCare),
      new Date(caregiver.dateOfBirth)
    );
    if (ageAtStart < 18) return true;
  }

  return false;
}

const dateFormatter: Tabulator.Formatter = (
  cell: Tabulator.CellComponent,
  formatterParams,
  onRender
) => {
  const date = cell.getValue() as Date;
  return date?.toLocaleDateString() ?? "";
};

const dateSorter = (
  a: Date,
  b: Date,
  _aRow,
  _bRow,
  _col,
  dir: "asc" | "desc"
) => {
  const dateA = a ? new Date(a) : new Date("0000-01-01");
  const dateB = b ? new Date(b) : new Date("0000-01-01");
  return dir === "asc" ? compareAsc(dateA, dateB) : compareDesc(dateB, dateA);
};

export const globalOptions = {
  headerSortElement: (row, dir) => {
    if (dir === "asc") return '<span class="fa-solid fa-sort-down"></span>';
    else if (dir === "desc") return '<span class="fa-solid fa-sort-up"></span>';
    else return '<span class="fa-solid fa-sort-down"></span>';
  },
};

export function applyFamilyFilter(filter: IFamilyFilter, value: any): boolean {
  switch (filter.filter) {
    case "equals":
      switch (filter.field as FamilyFields) {
        // number
        case "familyNumber":
        case "childrenInHousehold":
          return value === filter.value;
        // Date
        case "beginOfCare":
        case "endOfCare":
          return isSameDay(new Date(filter.value), new Date(value));
        // string
        case "location":
        case "otherInstalledProfessionals":
        case "highestEducation":
        case "comingFrom":
          return filter.value.toLowerCase() === value?.toLowerCase();
        // boolean
        case "childrenWithDisability":
        case "careGiverWithDisability":
        case "childWithPsychDiagnosis":
        case "caregiverWithPsychDiagnosis":
        case "migrationBackground":
          if (filter.filter === "equals") return value === true;
          else return value !== true;
        default:
          return value === filter.value;
      }
    case "not":
      if (filter.field === "beginOfCare" || filter.field === "endOfCare")
        return !isSameDay(new Date(value), new Date(filter.value));
      return value !== filter.value;
    case "lt":
      return value < filter.value;
    case "lte":
      return value <= filter.value;
    case "gt":
      return value > filter.value;
    case "gte":
      return value >= filter.value;
    case "startsWith":
      return ((value as string) || "").startsWith(filter.value);
    case "endsWith":
      return ((value as string) || "").endsWith(filter.value);
    case "contains":
      return ((value as string) || "")
        .toLowerCase()
        .includes(filter.value?.toLowerCase());
    default:
      return true;
  }
}

export function familyColumnsDefinition(
  survey?: FullSurvey
): ColumnDefinition[] {
  if (survey && !survey.hasFamily) return [];
  else
    return [
      {
        title: "Familie",
        columns: [
          { title: "Familiennummer", field: "familyNumber" },
          {
            title: "Beginn der Betreuung",
            field: "beginOfCare",
            formatter: dateFormatter,
            sorter: dateSorter,
            headerSortTristate: true,
          },
          { title: "Kinder", field: "childrenInHousehold" },
          { title: "Wohnort", field: "location" },
          {
            title: "Kinder mit Behinderung",
            field: "childrenWithDisability",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Kinder mit Psych. Diagnose",
            field: "childWithPsychDiagnosis",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "ElternTeil mit Behinderung",
            field: "careGiverWithDisability",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Elternteil mit Psych. Diagnose",
            field: "caregiverWithPsychDiagnosis",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Migrationshintergrund",
            field: "migrationBackground",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Höchster Bildungsabschluss",
            field: "highestEducation",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Andere installierte Fachkräfte",
            field: "otherInstalledProfessionals",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },

          {
            title: "Zugang über",
            field: "comingFrom",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Ende der Betreuung",
            field: "endOfCare",
            formatter: dateFormatter,
            sorter: dateSorter,
            headerSortTristate: true,
          },
          {
            title: "Verantwortlich",
            field: "createdBy",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Minderjährigkeit bei Betreuungsbeginn",
            field: "underage",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
        ],
      },
    ];
}

export function allAnswersColumnDefinition(
  survey: FullSurvey
): ColumnDefinition[] {
  return survey.questions.map<ColumnDefinition>((question) => {
    switch (question.type) {
      case QuestionType.Date: {
        return {
          title: question.questionText,
          field: question.id,
          formatter: dateFormatter,
          sorter: dateSorter,
          headerSortTristate: true,
        };
      }
      case QuestionType.Int: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Num: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Bool: {
        return {
          title: question.questionText,
          field: question.id,
          formatter: "tickCross",
          formatterParams: { allowEmpty: true },
          headerSortTristate: true,
        };
      }
      case QuestionType.Text: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Scale: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Select: {
        return {
          title: question.questionText,
          columns: question.selectOptions.map<ColumnDefinition>(
            (selectOption) => ({
              title: selectOption.value,
              field: `${question.id}.${selectOption.id}`,
              formatter: "tickCross",
              formatterParams: { allowEmpty: true },
              headerSortTristate: true,
            })
          ),
        };
      }
    }
  });
}
export function getWhereInputFromFamilyFilters(
  familyFilters: IFamilyFilter[]
): Prisma.FamilyWhereInput {
  let whereInputs: Prisma.FamilyWhereInput[] = [];

  for (const filter of familyFilters) {
    if (!filter?.field || !filter.filter) break;

    switch (filter.field as FamilyFields) {
      case "familyNumber":
        whereInputs.push({ number: { [filter.filter]: filter.value } });
        break;
      case "childrenInHousehold":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
          },
        });
        break;

      case "beginOfCare":
      case "endOfCare":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
          },
        });
        break;

      case "otherInstalledProfessionals":
      case "location":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
            mode: "insensitive",
          },
        });
        break;

      case "careGiverWithDisability":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { disability: { in: ["Yes", "Impending"] } } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: {
              none: { disability: { in: ["Yes", "Impending"] } },
            },
          });
        break;
      case "caregiverWithPsychDiagnosis":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { psychDiagosis: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: { none: { psychDiagosis: true } },
          });
        break;
      case "migrationBackground":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { migrationBackground: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: { none: { migrationBackground: true } },
          });
        break;

      case "childrenWithDisability":
        if (filter.filter === "equals")
          whereInputs.push({
            children: { some: { disability: { in: ["Yes", "Impending"] } } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            children: { none: { disability: { in: ["Yes", "Impending"] } } },
          });
        break;

      case "childWithPsychDiagnosis":
        if (filter.filter === "equals")
          whereInputs.push({
            children: { some: { psychDiagosis: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            children: { none: { psychDiagosis: true } },
          });
        break;
    }
  }

  return { AND: whereInputs };
}
