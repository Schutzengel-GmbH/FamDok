import {
  FullResponse,
  FullSurvey,
  IAnswerSelectOtherValues,
} from "@/types/prismaHelperTypes";
import { GridColDef } from "@mui/x-data-grid";
import { QuestionType } from "@prisma/client";

export function getColumnsForSurvey(survey: FullSurvey): GridColDef[] {
  let optionalFields: GridColDef[] = [];

  if (survey.hasFamily)
    optionalFields.push(
      { field: "Familiennummer", width: 200, description: "Familiennummer" },
      {
        field: "Familie aufgenommen am",
        width: 200,
        description: "Familie aufgenommen am",
      },
      {
        field: "Betreuung beendet am",
        width: 200,
        description: "Betreuung beendet am",
      }
    );

  let columns: GridColDef[] = [];

  columns.push(
    ...survey.questions.map((q) => {
      console.log(q);
      return {
        field: q.questionText,
        width: 200,
        description: q.questionText,
      };
    }),
    { field: "Erstellt durch", width: 200, description: "Erstellt durch" },
    ...optionalFields
  );

  console.log(columns);

  return columns;
}

export function getRowsForResponses(
  responses: FullResponse[],
  survey: FullSurvey
) {
  let rows: Record<string, any>[] = [];

  for (const response of responses) {
    let resRow: Record<string, any> = {};

    response.answers.map((a) => {
      switch (a.question.type) {
        case QuestionType.Bool:
          resRow[a.question.questionText] = a.answerBool;
          break;
        case QuestionType.Int:
          resRow[a.question.questionText] = a.answerInt;
          break;
        case QuestionType.Num:
          resRow[a.question.questionText] = a.answerNum;
          break;
        case QuestionType.Select:
          resRow[a.question.questionText] = a.answerSelect.reduce(
            (prev, curr, i) =>
              (prev += curr.isOpen
                ? curr.value +
                    ": " +
                    (
                      a.answerSelectOtherValues as IAnswerSelectOtherValues
                    ).find((asov) => asov.selectOptionId === curr.id)?.value ||
                  ""
                : curr.value + (i === a.answerSelect.length - 1 ? "" : ", ")),
            ""
          );
          break;
        case QuestionType.Text:
          resRow[a.question.questionText] = a.answerText;
          break;
        case QuestionType.Date:
          resRow[a.question.questionText] = a.answerDate
            ? new Date(a.answerDate).toLocaleDateString()
            : "";
          break;
        case QuestionType.Scale:
          resRow[a.question.questionText] = Number.isInteger(a.answerInt)
            ? a.answerInt +
              ` (${a.question.selectOptions[a.answerInt - 1]?.value || ""})`
            : "";
          break;
        default:
          resRow[a.question.questionText] = undefined;
      }
    });

    resRow["id"] = response.id;

    resRow["Erstellt durch"] =
      response.user?.name || response.user?.email || "";

    if (survey.hasFamily) {
      resRow["Familiennummer"] = response.family?.number || "";
      resRow["Familie aufgenommen am"] = response.family?.beginOfCare
        ? new Date(response.family?.beginOfCare).toLocaleDateString()
        : "";
      resRow["Betreuung beendet am"] = response.family?.endOfCare
        ? new Date(response.family?.beginOfCare).toLocaleDateString()
        : "";
    }

    rows.push(resRow);
  }

  return rows;
}
