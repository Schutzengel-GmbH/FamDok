import AnswerQuestion, {
  InputErrors,
} from "@/components/response/answerQuestion";
import {
  FullQuestion,
  FullSurvey,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { useFamily } from "@/utils/apiHooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { Family } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

type ResponsesFilterProps = {
  survey: FullSurvey;
  sx?: SxProps;
  answerFilter: ResponseFilter;
  onChange: (answerFilter: ResponseFilter) => void;
};

export default function ResponsesFilter({
  survey,
  sx,
  answerFilter,
  onChange,
}: ResponsesFilterProps) {
  const [question, setQuestion] = useState<FullQuestion>(null);
  const [familyNumber, setFamilyNumber] = useState<number>(null);
  const [familyChecked, setFamilyChecked] = useState<boolean>(false);

  const { family } = useFamily(familyNumber);

  useEffect(() => {
    onChange({
      ...answerFilter,
      filterFamily: familyChecked,
      familyId: family?.id,
    });
  }, [familyNumber, familyChecked]);

  function handleChangeQuestion(e: SelectChangeEvent<string>) {
    const q = survey.questions.find((q) => q.id === e.target.value);
    setQuestion(q);
    onChange({ question: q, filter: getDefaultAnswer(q) });
  }

  function handleQuestionFilterChange(
    answer: PartialAnswer,
    error: InputErrors
  ) {
    onChange({
      question,
      filter: answer,
      filterFamily: familyChecked,
      familyId: familyChecked ? family?.id : undefined,
    });
  }

  async function handleFamilyChange(e: ChangeEvent<HTMLInputElement>) {
    setFamilyNumber(parseInt(e.target.value));
  }

  function handleFamilyCheckedChange(e: ChangeEvent<HTMLInputElement>) {
    setFamilyChecked(e.target.checked);
  }

  return (
    <Box sx={sx}>
      <Paper sx={{ m: "1rem", p: ".5rem" }}>
        <Typography>Filtern nach:</Typography>
        <Select value={question?.id || ""} onChange={handleChangeQuestion}>
          <MenuItem value="">Kein Filter</MenuItem>
          {survey?.questions?.map((q) => (
            <MenuItem key={q.id} value={q.id}>
              {q.questionText}
            </MenuItem>
          ))}
        </Select>
        {question && (
          <Box sx={{ mt: ".5rem" }}>
            <AnswerQuestion
              question={question}
              onChange={handleQuestionFilterChange}
              answer={answerFilter.filter}
            />
          </Box>
        )}
        {survey?.hasFamily && (
          <Box sx={{ mt: "1rem", display: "flex", flexDirection: "column  " }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={familyChecked}
                  onChange={handleFamilyCheckedChange}
                />
              }
              label="Nur Antworten zu Familie mit dieser Nummer:"
            />
            <TextField
              label={"Familiennummer"}
              value={familyNumber || ""}
              onChange={handleFamilyChange}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

function getDefaultAnswer(q: FullQuestion) {
  if (!q) return undefined;
  return {
    questionId: q.id,
    answerText: q.defaultAnswerText || undefined,
    answerBool: q.defaultAnswerBool || undefined,
    answerInt: q.defaultAnswerInt || undefined,
    answerNum: q.defaultAnswerNum || undefined,
    answerSelect: q.defaultAnswerSelectOptions || [],
    answerDate: q.defaultAnswerDate || undefined,
  };
}

export type ResponseFilter = {
  question?: FullQuestion;
  filter?: PartialAnswer;
  filterFamily?: boolean;
  familyId?: string;
};

