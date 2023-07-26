import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function AnswerDateComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  return (
    <FormControl sx={{ marginTop: "1rem" }}>
      <DatePicker
        onChange={(date) => {
          if (date) onChange({ ...answer, answerDate: date });
        }}
        value={
          answer
            ? new Date(answer.answerDate)
            : question.defaultAnswerDate ?? undefined
        }
      />
    </FormControl>
  );
}
