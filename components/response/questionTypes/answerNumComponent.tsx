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
      onChange({ ...answer, answerNum: undefined });
      return;
    }

    if (!isFloat(_valueString)) {
      setError("Bitte eine Zahl eingeben.");
      onChange(answer, InputErrors.NAN);
      return;
    }

    const _value = parseFloat(_valueString.replace(",", "."));

    setError("");
    onChange({ ...answer, answerNum: _value });
  }

  return (
    <FormControl>
      <TextField
        value={valueString?.replace(".", ",") || ""}
        onChange={handleChange}
        error={error !== ""}
        helperText={error}
      />
    </FormControl>
  );
}
