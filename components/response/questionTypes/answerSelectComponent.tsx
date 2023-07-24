import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useState, ChangeEvent } from "react";

export default function AnswerSelectComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer.answerSelectOtherValues as IAnswerSelectOtherValues) || []
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...answer,
      answerSelect: [{ id: e.target.value }],
      answerSelectOtherValues: otherValues,
    });
  }

  function updateOtherValues(id: string, value: string) {
    const index = otherValues.findIndex((o) => o.selectOptionId === id);
    let newValues = [...otherValues];
    if (index > -1) {
      newValues[index] = { selectOptionId: id, value: value };
      setOtherValues(newValues);
    } else {
      newValues.push({ selectOptionId: id, value: value });
      setOtherValues(newValues);
    }
    onChange({ ...answer, answerSelectOtherValues: newValues });
  }

  function isChecked(o: Partial<SelectOption>): boolean {
    return answer
      ? answer.answerSelect.findIndex((a) => a.id === o.id) >= 0
      : question.defaultAnswerSelectOptions.findIndex((a) => a.id === o.id) >=
          0 || false;
  }

  return (
    <FormControl>
      <RadioGroup onChange={handleChange}>
        {question.selectOptions.map((o) => (
          <FormControlLabel
            key={o.id}
            value={o.id}
            control={<Radio checked={isChecked(o)} />}
            label={
              o.isOpen ? (
                <TextField
                  value={
                    otherValues?.find((v) => v.selectOptionId === o.id)
                      ?.value || ""
                  }
                  onChange={(e) => {
                    updateOtherValues(o.id, e.currentTarget.value);
                  }}
                />
              ) : (
                o.value
              )
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
