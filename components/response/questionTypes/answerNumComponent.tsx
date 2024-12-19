import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { isFloat } from "@/utils/utils";

export default function AnswerNumComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [value, setValue] = useState<string>(
    answer
      ? answer.answerNum?.toString()
      : question.defaultAnswerNum?.toString() || ""
  );
  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValue(_valueString);

    const _value = parseFloat(_valueString);

    if (_valueString && !isFloat(_valueString)) {
      setError("Bitte eine Zahl eingeben.");
      onChange(answer, InputErrors.NAN);
      return;
    }

    setError("");
    onChange({ ...answer, answerNum: _value });
  }

  return (
    <FormControl>
      <TextField
        value={value}
        onChange={handleChange}
        inputProps={{ inputMode: "decimal" }}
        error={error !== ""}
        helperText={error}
      />
    </FormControl>
  );
}

