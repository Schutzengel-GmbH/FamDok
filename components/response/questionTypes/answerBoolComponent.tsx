import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AnswerComponentProps } from "../answerQuestion";
import { useState } from "react";

export default function AnswerBoolComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [value, setValue] = useState<boolean | undefined>(
    answer ? answer.answerBool : question.defaultAnswerBool || undefined
  );

  return (
    <FormControl>
      <RadioGroup
        onChange={(e) => {
          const ansValue = e.target.value == "true" ? true : false;
          setValue(ansValue);
          onChange({ ...answer, answerBool: ansValue });
        }}
      >
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
