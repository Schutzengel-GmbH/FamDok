import { FormControl, TextField } from "@mui/material";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { ChangeEvent, useState } from "react";
import { isInt } from "@/utils/utils";
import { Question } from "@prisma/client";

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

    if (_valueString && !isInt(_valueString)) {
      setError("Bitte eine ganze Zahl eingeben.");
      onChange(answer, InputErrors.NAN);
      return;
    }

    if (
      Number(_valueString) > 2147483647 ||
      Number(_valueString) < -2147483647
    ) {
      setError("Zahl ist zu groß oder zu klein für 32bit-signed-Integer");
      onChange(answer, InputErrors.NUM_OUT_OF_BOUNDS);
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
        error={error !== ""}
        helperText={error}
        inputProps={
          question.intRange
            ? {
                inputMode: "numeric",
                min: question.intRangeLow,
                max: question.intRangeHigh,
              }
            : { inputMode: "numeric" }
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
