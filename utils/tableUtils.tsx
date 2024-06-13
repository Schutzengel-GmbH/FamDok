import {
  FullResponse,
  FullSurvey,
  IAnswerSelectOtherValue,
} from "@/types/prismaHelperTypes";
import { getEducationString, isHigherEducation } from "@/utils/utils";
import { QuestionType } from "@prisma/client";
import { compareAsc, compareDesc } from "date-fns";
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
};

export function responsesToAllAnswersTable(
  responses: FullResponse[]
): ResponseTableData[] {
  let result: ResponseTableData[] = [];

  if (!responses) return result;

  for (const response of responses) {
    let data: ResponseTableData = {};
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
      data["familyNumber"] = response.family.number;
      data["beginOfCare"] = response.family.beginOfCare
        ? new Date(response.family.beginOfCare)
        : undefined;
      data["childrenInHousehold"] = response.family.childrenInHousehold;
      data["location"] = response.family.location;
      data["childrenWithDisability"] =
        response.family.children?.reduce<boolean>(
          (b, ch) =>
            ch.disability === "Yes" || ch.disability === "Impending"
              ? (b = true)
              : b,
          false
        );
      data["careGiverWithDisability"] =
        response.family.caregivers?.reduce<boolean>(
          (b, c) =>
            c.disability === "Yes" || c.disability === "Impending"
              ? (b = true)
              : b,
          false
        );
      data["childWithPsychDiagnosis"] =
        response.family.children?.reduce<boolean>(
          (b, ch) => (ch.psychDiagosis === true ? (b = true) : b),
          false
        );
      data["caregiverWithPsychDiagnosis"] =
        response.family.caregivers?.reduce<boolean>(
          (b, c) => (c.psychDiagosis === true ? (b = true) : b),
          false
        );
      data["migrationBackground"] = response.family.caregivers?.reduce<boolean>(
        (b, c) => (c.migrationBackground === true ? (b = true) : b),
        false
      );
      data["highestEducation"] = response.family.caregivers?.reduce(
        (prev, c, i, caregivers) => {
          if (i === 0) return getEducationString(c.education);
          else if (isHigherEducation(c.education, caregivers[i - 1].education))
            return getEducationString(c.education);
          else return prev;
        },
        ""
      );
      data["otherInstalledProfessionals"] =
        response.family.otherInstalledProfessionals;
      data["comingFrom"] = response.family.comingFrom?.value || undefined;
      data["endOfCare"] = response.family.endOfCare
        ? new Date(response.family.endOfCare)
        : undefined;
    }
    result.push(data);
  }

  return result;
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

export function familyColumnsDefinition(
  survey: FullSurvey
): ColumnDefinition[] {
  if (!survey.hasFamily) return [];
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
          { title: "Höchster Bildungsabschluss", field: "highestEducation" },
          {
            title: "Andere installierte Fachkräfte",
            field: "otherInstalledProfessionals",
          },

          { title: "Zugang über", field: "comingFrom" },
          {
            title: "Ende der Betreuung",
            field: "endOfCare",
            formatter: dateFormatter,
            sorter: dateSorter,
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
