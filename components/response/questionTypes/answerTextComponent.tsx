import { FormControl, TextField } from "@mui/material";
import { AnswerComponentProps } from "@/components/response/answerQuestion";

export default function AnswerTextComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  return (
    <FormControl>
      <TextField
        value={answer?.answerText ?? question.defaultAnswerText ?? ""}
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
