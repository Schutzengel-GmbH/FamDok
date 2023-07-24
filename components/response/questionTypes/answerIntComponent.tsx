import { FormControl, TextField } from "@mui/material";
import { AnswerComponentProps } from "../answerQuestion";
import { ChangeEvent, useState } from "react";

export default function AnswerIntComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [value, setValue] = useState<number | undefined>(
    answer ? answer.answerInt : question.defaultAnswerInt || undefined
  );
  const [intOutOfRange, updateIntOutOfRange] = useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _value = parseInt(e.currentTarget.value);
    if (Number.isNaN(_value)) setValue(0);
    else setValue(_value);
    if (question.intRange)
      updateIntOutOfRange(
        _value < question.intRangeLow || _value > question.intRangeHigh
      );
    onChange({ ...answer, answerInt: _value });
  }

  return (
    <FormControl>
      <TextField
        value={value}
        onChange={handleChange}
        type="number"
        error={intOutOfRange}
        helperText={
          intOutOfRange ? "Eingabe größer oder kleiner als Maximum/Minimum" : ""
        }
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
