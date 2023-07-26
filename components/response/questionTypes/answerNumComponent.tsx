import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { isFloat, isInt } from "@/utils/utils";

export default function AnswerNumComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [valueString, setValueString] = useState<string | undefined>(
    answer
      ? answer.answerNum?.toString()
      : question.defaultAnswerNum?.toString() || undefined
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

    if (!isFloat(_valueString)) {
      setError("Bitte eine Zahl eingeben.");
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
        error={error !== ""}
        helperText={error}
        inputMode="decimal"
      />
    </FormControl>
  );
}
