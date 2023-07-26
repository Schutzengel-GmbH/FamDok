import { InputErrors } from "@/components/response/answerQuestion";
import { Alert, Box, Paper, SxProps } from "@mui/material";
import { Question, Survey } from "@prisma/client";

type InputErrorsComponentProps = {
  survey: Survey & { questions: Question[] };
  errors: { questionId: string; error: InputErrors }[];
};

export default function InputErrorsComponent({
  survey,
  errors,
}: InputErrorsComponentProps) {
  if (errors.length < 1) return <></>;

  return (
    <Paper sx={{ p: ".5rem", gap: ".5rem" }} elevation={3}>
      {errors.map((e) => (
        <Alert severity="error">
          {getInputErrorMessage(
            survey.questions.find((q) => q.id === e.questionId),
            e.error
          )}
        </Alert>
      ))}
    </Paper>
  );
}

function getInputErrorMessage(question: Question, error: InputErrors) {
  switch (error) {
    case InputErrors.NAN:
      return `Bei der Frage ${question.questionTitle} muss eine Zahl angegeben werden.`;
    case InputErrors.NUM_OUT_OF_RANGE:
      return `Bei der Frage ${question.questionTitle} muss eine Zahl zwischen ${question.intRangeLow} und ${question.intRangeHigh} angegeben werden.`;
    case InputErrors.REQUIRED:
      return `Die Frage ${question.questionTitle} ist nicht optional.`;
    default:
      return `Bei der Frage ${question.questionTitle} ist ein unbekannter Fehler aufgetreten.`;
  }
}
