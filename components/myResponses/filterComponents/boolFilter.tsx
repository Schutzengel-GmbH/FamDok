import { BoolFilter } from "@/components/myResponses/filter.t";
import { QuestionFilterProps } from "@/components/myResponses/questionFilter";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState, ChangeEvent } from "react";

export default function BoolFilter({ filter, onChange }: QuestionFilterProps) {
  const f = filter.filter as BoolFilter;

  const [value, setValue] = useState<boolean | undefined>(
    f?.filterBool
      ? f.filterBool
      : filter.question.defaultAnswerBool || undefined
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const ansValue =
      e.target.value == "true"
        ? true
        : e.target.value == "false"
        ? false
        : null;
    setValue(ansValue);
    onChange({
      ...filter,
      filter: { filterBool: ansValue } as BoolFilter,
    });
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
        <FormControlLabel
          key={3}
          value={undefined}
          control={<Radio checked={value === null} />}
          label="Frage nicht beantwortet"
        />
      </RadioGroup>
    </FormControl>
  );
}

