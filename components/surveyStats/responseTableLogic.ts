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
      { field: "family.number", width: 200, headerName: "Familiennummer" },
      {
        field: "family.beginOfCare",
        width: 200,
        headerName: "Familie aufgenommen am",
      },
      {
        field: "family.endOfCare",
        width: 200,
        headerName: "Betreuung beendet am",
      }
    );

  let columns: GridColDef[] = [];

  columns.push(
    ...survey.questions.map((q) => {
      return {
        field: q.id,
        width: 200,
        headerName: q.questionText,
      };
    }),
    { field: "Erstellt durch", width: 200, headerName: "Erstellt durch" },
    ...optionalFields
  );

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
          resRow[a.question.id] = a.answerBool;
          break;
        case QuestionType.Int:
          resRow[a.question.id] = a.answerInt;
          break;
        case QuestionType.Num:
          resRow[a.question.id] = a.answerNum;
          break;
        case QuestionType.Select:
          resRow[a.question.id] = a.answerSelect?.reduce(
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
          resRow[a.question.id] = a.answerText;
          break;
        case QuestionType.Date:
          resRow[a.question.id] = a.answerDate
            ? new Date(a.answerDate).toLocaleDateString()
            : "";
          break;
        case QuestionType.Scale:
          resRow[a.question.id] = `${a.answerSelect[0]?.value} (${
            a.question.selectOptions.findIndex(
              (o) => o.id === a.answerSelect[0]?.id
            ) + 1
          })`;
          break;
        default:
          resRow[a.question.id] = undefined;
      }
    });

    resRow["id"] = response.id;

    resRow["Erstellt durch"] =
      response.user?.name || response.user?.email || "";

    if (survey.hasFamily) {
      resRow["family.number"] = response.family?.number || "";
      resRow["family.beginOfCare"] = response.family?.beginOfCare
        ? new Date(response.family?.beginOfCare).toLocaleDateString()
        : "";
      resRow["family.endOfCare"] = response.family?.endOfCare
        ? new Date(response.family?.beginOfCare).toLocaleDateString()
        : "";
    }

    rows.push(resRow);
  }

  return rows;
}

