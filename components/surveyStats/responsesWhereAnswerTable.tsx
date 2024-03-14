import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ChangeEvent, useState } from "react";

type ResponsesWhereAnswerTableProps = { survey: FullSurvey };
export default function ResponsesWhereAnswerTable({
  survey,
}: ResponsesWhereAnswerTableProps) {
  const [questionId, setQuestionId] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const { responses } = useResponses(survey.id);

  function handleQuestionChange(e: SelectChangeEvent) {
    setQuestionId(e.target.value);
  }

  function handleAnswerChange(e: ChangeEvent<HTMLInputElement>) {
    setAnswer(e.target.value);
  }

  const columns: GridColDef[] = [
    { field: "answer", headerName: "Antwort", width: 150 },
    { field: "number", headerName: "Anzahl", width: 150 },
  ];

  const rows: Record<"answer" | "number" | "id", any>[] = [];

  return (
    <Box>
      <Select value={questionId} onChange={handleQuestionChange}>
        {survey.questions.map((q) => (
          <MenuItem key={q.id} value={q.id}>
            {q.questionTitle || q.questionText}
          </MenuItem>
        ))}
      </Select>
      <TextField value={answer} onChange={handleAnswerChange} />
      <DataGrid columns={columns} rows={rows} />
    </Box>
  );
}

