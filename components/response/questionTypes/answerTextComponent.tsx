import { FullQuestion, PartialAnswer } from "@/types/prismaHelperTypes";
import { Box, FormControl, TextField } from "@mui/material";

type AnswerTextComponentProps = {
  question: FullQuestion;
  answer?: PartialAnswer;
  onChange: (answer: PartialAnswer) => void;
};

export default function AnswerTextComponent({
  question,
  answer,
  onChange,
}: AnswerTextComponentProps) {
  return (
    <FormControl>
      <TextField
        value={answer?.answerText || question.defaultAnswerText || ""}
        onChange={(e) => {
          onChange({
            ...answer,
            answerText: e.currentTarget.value,
            questionId: question.id,
          });
        }}
      />
    </FormControl>
  );
}
