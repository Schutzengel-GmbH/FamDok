import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { AnswerComponentProps } from "../answerQuestion";

export default function AnswerNumComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [value, setValue] = useState<number | undefined>(
    answer ? answer.answerNum : question.defaultAnswerNum || undefined
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _value = parseFloat(e.currentTarget.value);
    if (Number.isNaN(_value)) setValue(0);
    else setValue(_value);
    onChange({ ...answer, answerNum: _value });
  }

  return (
    <FormControl>
      <TextField value={value} onChange={handleChange} type="number" />
    </FormControl>
  );
}
