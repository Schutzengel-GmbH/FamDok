import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import { getAnswerString } from "@/utils/utils";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef, GridColType } from "@mui/x-data-grid";
import { QuestionType } from "@prisma/client";
import { useState } from "react";

type ResponsesWhereAnswerTableProps = { survey: FullSurvey };
export default function ResponsesWhereAnswerTable({
  survey,
}: ResponsesWhereAnswerTableProps) {
  const [questionId, setQuestionId] = useState<string>("");
  const { responses } = useResponses(survey.id);
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "answer", headerName: "Antwort" },
    { field: "number", headerName: "Anzahl" }
  ])
  const [rows, setRows] = useState<Record<string, any>[]>([])

  function handleQuestionChange(e: SelectChangeEvent) {
    const id = e.target.value;
    setQuestionId(id);
    let result: Record<string, any>[] = []
    if (!responses) return;

    const question = survey.questions.find(q => q.id === id);
    const qType = question.type;

    result.push({ id: "0", answer: "- Keine Antwort -", number: 0 });

    if (qType === "Select") {
      question.selectOptions.forEach(so => so.isOpen ? {} : result.push({ id: so.id, answer: so.value, number: 0 }));
    }

    if (qType === "Scale") {
      question.selectOptions.forEach((so, i) => result.push({ id: so.id, answer: `${i + 1} (${so.value})`, number: 0 }));
    }

    for (const response of responses) {
      const answer = response.answers.find(r => r.questionId === id);

      if (!answer) result[0].number += 1;

      else {
        if (qType === "Select") {
          for (let selOption of answer.answerSelect) {
            const answerString = selOption.isOpen ? (answer.answerSelectOtherValues as Array<any>).find(ao => ao.selectOptionId === selOption.id).value : selOption.value;
            const index = result.findIndex(r => r.answer === answerString)
            if (index < 0) result.push({ id: selOption.id, answer: answerString, number: 1 })
            else result[index].number += 1;
          }
        } else if (qType === "Scale") {
          const index = result.findIndex(r => r.id === answer.answerSelect[0]?.id);
          if (index >= 0) result[index].number += 1;
          else result[0].number += 1;
        } else {
          const answerString = getAnswerString(answer);
          const index = result.findIndex(r => r.answer === answerString);
          if (index < 0) result.push({ id: response.id, answer: answerString, number: 1 });
          else result[index].number += 1;
        }
      }
    }

    setRows(result)
    setColumns([
      { field: "answer", width: 500, headerName: "Antwort", type: getColumnTypeForQuestionType(survey.questions.find(q => q.id === id).type) },
      { field: "number", width: 200, headerName: "Anzahl", type: "number" }
    ])
  }

  return (
    <Box>
      <Select value={questionId} onChange={handleQuestionChange}>
        {survey.questions.map((q) => (
          <MenuItem key={q.id} value={q.id}>
            {q.questionTitle || q.questionText}
          </MenuItem>
        ))}
      </Select>
      <DataGrid columns={columns} rows={rows} />
    </Box>
  );
}

function getColumnTypeForQuestionType(questionType: QuestionType): GridColType {
  switch (questionType) {
    case "Int": return "number";
    case "Num": return "number";
    case "Text": return "string";
    case "Bool": return "boolean";
    case "Date": return "string";
    case "Scale": return "string";
    case "Select": return "string";
    default: return "string";
  }
}