import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FormControl,
  TextField,
} from "@mui/material";
import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { useAutocomplete } from "@/utils/apiHooks";

export default function AnswerTextComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const { autocomplete } = useAutocomplete(question.surveyId, question.id);

  return (
    <FormControl>
      {question.autocomplete && (
        <Autocomplete
          freeSolo
          inputValue={answer?.answerText ?? question.defaultAnswerText ?? ""}
          onInputChange={(e, value) => {
            onChange({
              ...answer,
              answerText: value,
              questionId: question.id,
            });
          }}
          renderInput={(params) => <TextField {...params} />}
          options={autocomplete}
        />
      )}
      {!question.autocomplete && (
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
      )}
    </FormControl>
  );
}

