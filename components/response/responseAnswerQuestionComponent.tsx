import { Box } from "@mui/material";
import { FullSurvey, PartialAnswer } from "@/types/prismaHelperTypes";
import AnswerQuestion, { InputErrors } from "./answerQuestion";
import { compareAsc } from "date-fns";

type ResponseAnswerQuestionsComponentProps = {
  answersState: PartialAnswer[];
  survey: FullSurvey;
  onChange: (newAnswer: PartialAnswer, error?: InputErrors) => void;
};

export default function ResponseAnswerQuestionsComponent({
  answersState,
  survey,
  onChange,
}: ResponseAnswerQuestionsComponentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {survey.questions
        .sort((a, b) =>
          compareAsc(new Date(a.createdAt), new Date(b.createdAt))
        )
        .map((q, i) => (
          <AnswerQuestion
            key={i}
            answer={answersState.find((a) => a.questionId === q.id)}
            question={q}
            onChange={onChange}
          />
        ))}
    </Box>
  );
}
