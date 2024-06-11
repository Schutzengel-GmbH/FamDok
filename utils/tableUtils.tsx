import {
  FullResponse,
  FullSurvey,
  IAnswerSelectOtherValue,
} from "@/types/prismaHelperTypes";
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
