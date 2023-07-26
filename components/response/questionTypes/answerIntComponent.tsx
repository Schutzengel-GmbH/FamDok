import { FormControl, TextField } from "@mui/material";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { ChangeEvent, useState } from "react";
import { isInt } from "@/utils/utils";

export default function AnswerIntComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [valueString, setValueString] = useState(
    answer
      ? answer.answerInt?.toString()
      : question.defaultAnswerInt?.toString() || undefined
  );
  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValueString(_valueString);

    if (!_valueString) {
      setError("");
      onChange({ ...answer, answerInt: undefined });
      return;
    }

    if (!isInt(_valueString)) {
      setError("Bitte eine ganze Zahl eingeben.");
      onChange(answer, InputErrors.NAN);
      return;
    }

    const _value = parseInt(_valueString);

    if (
      question.intRange &&
      (_value < question.intRangeLow || _value > question.intRangeHigh)
    ) {
      setError("");
      onChange(answer, InputErrors.NUM_OUT_OF_RANGE);
      return;
    }

    setError("");
    onChange({ ...answer, answerInt: _value });
  }

  return (
    <FormControl>
      <TextField
        value={valueString}
        onChange={handleChange}
        inputMode="numeric"
        error={error !== ""}
        helperText={error}
        InputProps={
          question.intRange
            ? {
                inputProps: {
                  min: question.intRangeLow || 0,
                  max: question.intRangeHigh,
                },
              }
            : {}
        }
      />
    </FormControl>
  );
}
