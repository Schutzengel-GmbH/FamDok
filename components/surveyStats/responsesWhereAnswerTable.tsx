import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import { getAnswerString } from "@/utils/utils";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

type ResponsesWhereAnswerTableProps = { survey: FullSurvey };
export default function ResponsesWhereAnswerTable({
  survey,
}: ResponsesWhereAnswerTableProps) {
  const [questionId, setQuestionId] = useState<string>("");
  const { responses } = useResponses(survey.id);

  function handleQuestionChange(e: SelectChangeEvent) {
    setQuestionId(e.target.value);
  }


  const columns: GridColDef[] = [
    { field: "answer", headerName: "Antwort", width: 150 },
    { field: "number", headerName: "Anzahl", width: 150 },
  ];

  function getRowsForQuestion(questionId: string): Record<"answer" | "number" | "id", any>[] {
    let result: Record<"answer" | "number" | "id", any>[] = []

    if (!responses) return result;
    for (let response of responses) {
      const answer = response.answers.find(r => r.questionId === questionId);

      if (!answer) continue;
      if (answer.question.type === "Select" && answer.question.selectMultiple) {
        for (let selOption of answer.answerSelect) {
          const answerString = selOption.isOpen ? (answer.answerSelectOtherValues as Array<any>).find(ao => ao.selectOptionId === selOption.id).value : selOption.value;
          const index = result.findIndex(r => r.answer === answerString)
          if (index < 0) result.push({ id: selOption.id, answer: answerString, number: 1 })
          else result[index].number += 1;
        }
      } else {
        const answerString = answer ? getAnswerString(answer) : "";
        const index = result.findIndex(r => r.answer === answerString);
        if (index < 0) result.push({ id: response.id, answer: answerString, number: 1 });
        else result[index].number += 1;
      }
    }

    return result;
  }

  const rows: Record<"answer" | "number" | "id", any>[] = getRowsForQuestion(questionId);

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