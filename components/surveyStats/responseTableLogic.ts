import {
  FullResponse,
  FullSurvey,
  IAnswerSelectOtherValues,
} from "@/types/prismaHelperTypes";
import { getAge, getEducationString, isHigherEducation } from "@/utils/utils";
import { GridColDef } from "@mui/x-data-grid";
import { Caregiver, Child, Education, QuestionType } from "@prisma/client";
import {
  Fields,
  optionalFields,
} from "@/components/surveyStats/responseTableFields";

export function getColumnsForSurvey(survey: FullSurvey): GridColDef[] {
  let columns: GridColDef[] = [];

  for (let question of survey.questions) {
    if (question.type === QuestionType.Select) {
      columns.push(
        ...question.selectOptions.map((option) => {
          return {
            field: option.id,
            width: 100,
            headerName: option.value,
            type: option.isOpen ? "string" : "boolean",
          };
        })
      );
    } else {
      columns.push({
        field: question.id,
        width: 100,
        headerName: question.questionText,
        type: getFieldType(question.type),
      });
    }
  }

  columns.push({
    field: "Erstellt durch",
    width: 200,
    headerName: "Erstellt durch",
  });

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
          for (let option of a.question.selectOptions) {
            if (option.isOpen)
              resRow[option.id] = a.answerSelect.find((o) => o.id === option.id)
                ? (a.answerSelectOtherValues as IAnswerSelectOtherValues)?.find(
                    (v) => v.selectOptionId === option.id
                  ).value
                : "";
            else
              resRow[option.id] = a.answerSelect.find((o) => o.id === option.id)
                ? true
                : false;
          }
          break;
        case QuestionType.Text:
          resRow[a.question.id] = a.answerText;
          break;
        case QuestionType.Date:
          resRow[a.question.id] = a.answerDate ? new Date(a.answerDate) : null;
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
      resRow[Fields.number] = response.family?.number || "";
      resRow[Fields.beginOfCare] = response.family?.beginOfCare
        ? new Date(response.family?.beginOfCare)
        : null;
      resRow[Fields.endOfCare] = response.family?.endOfCare
        ? new Date(response.family?.endOfCare)
        : null;
      resRow[Fields.hasChildDisability] = response.family?.children?.reduce(
        (n, c) =>
          c.disability === "Yes" || c.disability === "Impending" ? n + 1 : n,
        0
      );
      resRow[Fields.hasCaregiverDisability] =
        response.family?.caregivers?.reduce(
          (n, c) =>
            c.disability === "Yes" || c.disability === "Impending" ? n + 1 : n,
          0
        );
      resRow[Fields.hasMigrationBackground] = response.family?.caregivers?.find(
        (c) => c.migrationBackground
      );
      resRow[Fields.highestEducation] = response.family?.caregivers?.reduce(
        (prev, c, i, caregivers) => {
          if (i === 0) return getEducationString(c.education);
          else if (isHigherEducation(c.education, caregivers[i - 1].education))
            return getEducationString(c.education);
          else return prev;
        },
        ""
      );
      resRow[Fields.hasCaregiverPsychDiagnosis] =
        response.family?.caregivers?.find((c) => c.psychDiagosis);
      resRow[Fields.childrenInHousehold] =
        response.family?.childrenInHousehold ??
        response.family?.children?.length ??
        0;
      resRow[Fields.location] = response.family?.location || "";
      resRow[Fields.otherInstalledProfessionals] =
        response.family?.otherInstalledProfessionals || "";
      resRow[Fields.comingFrom] = response.family?.comingFrom?.value || "";
    }

    rows.push(resRow);
  }

  return rows;
}

function getFieldType(questionType: QuestionType) {
  switch (questionType) {
    case "Text":
      return "string";
    case "Bool":
      return "boolean";
    case "Int":
      return "number";
    case "Num":
      return "number";
    case "Select":
      return "string";
    case "Date":
      return "date";
    case "Scale":
      return "string";
  }
}
