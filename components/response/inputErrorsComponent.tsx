import { InputErrors } from "@/components/response/answerQuestion";
import { Alert, Box, Paper, SxProps } from "@mui/material";
import { Question, Survey } from "@prisma/client";

type InputErrorsComponentProps = {
  survey: Survey & { questions: Question[] };
  errors: { questionId: string; error: InputErrors }[];
  noRequiredMasterData?: boolean;
};

export default function InputErrorsComponent({
  survey,
  errors,
  noRequiredMasterData,
}: InputErrorsComponentProps) {
  if (errors.length < 1 && !noRequiredMasterData) return <></>;

  return (
    <Paper sx={{ p: ".5rem", gap: ".5rem" }} elevation={3}>
      {errors.map((e) => (
        <Alert severity="error" key={e.questionId}>
          {getInputErrorMessage(
            survey.questions.find((q) => q.id === e.questionId),
            e.error
          )}
        </Alert>
      ))}
      {noRequiredMasterData === true && (
        <Alert severity="error">
          Die Angabe eines Stammdatensatzes ist erforderlich.
        </Alert>
      )}
    </Paper>
  );
}

function getInputErrorMessage(question: Question, error: InputErrors) {
  switch (error) {
    case InputErrors.NAN:
      return `Bei der Frage ${
        question.questionTitle || question.questionText
      } muss eine Zahl angegeben werden.`;
    case InputErrors.NUM_OUT_OF_RANGE:
      return getOutOfRangeMessage(question);
    case InputErrors.REQUIRED:
      return `Die Frage ${
        question.questionTitle || question.questionText
      } ist nicht optional.`;
    case InputErrors.NUM_OUT_OF_BOUNDS:
      return `Die Antwort zur Frage ${
        question.questionTitle || question.questionText
      } ist zu groß oder zu klein für 32bit-signed-Integer.`;
    default:
      return `Bei der Frage ${
        question.questionTitle || question.questionText
      } ist ein unbekannter Fehler aufgetreten.`;
  }
}

function getOutOfRangeMessage(question: Question) {
  if (question.intRangeLow != null && question.intRangeHigh != null)
    return `Bei der Frage ${
      question.questionTitle || question.questionText
    } muss eine Zahl zwischen ${question.intRangeLow} und ${
      question.intRangeHigh
    } angegeben werden.`;
  else if (question.intRangeLow != null && question.intRangeHigh == null)
    return `Bei der Frage ${
      question.questionTitle || question.questionText
    } muss eine Zahl von mindestens ${
      question.intRangeLow
    } oder größer angegeben werden.`;
  else if (question.intRangeLow == null && question.intRangeHigh != null)
    return `Bei der Frage ${
      question.questionTitle || question.questionText
    } muss eine Zahl kleiner oder gleich ${
      question.intRangeHigh
    } angegeben werden.`;
  else
    return `Bei der Antwort zur Frage ${
      question.questionTitle || question.questionText
    } liegt ein unbekannter Fehler vor. Bitte eine ganze Zahl im zulässigen Bereich angeben.`;
}
