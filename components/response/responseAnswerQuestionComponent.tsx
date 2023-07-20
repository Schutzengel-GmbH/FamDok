import { Box } from "@mui/material";
import { FullSurvey, PartialAnswer } from "@/types/prismaHelperTypes";
import AnswerQuestion from "./answerQuestion";

type ResponseAnswerQuestionsComponentProps = {
  answersState: PartialAnswer[];
  survey: FullSurvey;
  onChange: (newAnswer: PartialAnswer) => void;
};

export default function ResponseAnswerQuestionsComponent({
  answersState,
  survey,
  onChange,
}: ResponseAnswerQuestionsComponentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {survey.questions.map((q, i) => (
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
