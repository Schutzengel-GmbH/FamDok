import { FormControl, TextField } from "@mui/material";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { ChangeEvent, useState } from "react";
import { isInt } from "@/utils/utils";
import { Answer, Question } from "@prisma/client";
import { PartialAnswer } from "@/types/prismaHelperTypes";

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

    if (question.intRange)
      if (isOutOfRange(_value, question)) {
        setError("Zahl zu groß oder zu klein");
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
                  min: question.intRangeLow,
                  max: question.intRangeHigh,
                },
              }
            : {}
        }
      />
    </FormControl>
  );
}

function isOutOfRange(value: number, question: Question) {
  if (question.intRangeLow != null && question.intRangeHigh != null)
    return value < question.intRangeLow || value > question.intRangeHigh;
  else if (question.intRangeLow != null && question.intRangeHigh == null)
    return value < question.intRangeLow;
  else if (question.intRangeLow == null && question.intRangeHigh != null)
    return value > question.intRangeHigh;
  return false;
}

