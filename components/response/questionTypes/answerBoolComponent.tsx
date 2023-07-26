import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AnswerComponentProps, InputErrors } from "../answerQuestion";
import { ChangeEvent, useState } from "react";

export default function AnswerBoolComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [value, setValue] = useState<boolean | undefined>(
    answer ? answer.answerBool : question.defaultAnswerBool || undefined
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const ansValue = e.target.value == "true" ? true : false;
    setValue(ansValue);
    onChange({ ...answer, answerBool: ansValue });
  }

  return (
    <FormControl>
      <RadioGroup onChange={handleChange}>
        <FormControlLabel
          key={0}
          value={"true"}
          control={<Radio checked={value === true} />}
          label="Ja"
        />
        <FormControlLabel
          key={1}
          value={"false"}
          control={<Radio checked={value === false} />}
          label="Nein"
        />
      </RadioGroup>
    </FormControl>
  );
}
