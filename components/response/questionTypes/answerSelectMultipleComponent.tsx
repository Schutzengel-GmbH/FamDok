import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import { TextField, Checkbox, List, ListItem } from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AnswerSelectMultipleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer?.answerSelectOtherValues as IAnswerSelectOtherValues) || []
  );

  function handleChange(checked: boolean, selectOption: SelectOption) {
    if (checked)
      onChange({
        ...answer,
        answerSelect: [...answer.answerSelect, selectOption],
      });
    else
      onChange({
        ...answer,
        answerSelect: answer.answerSelect.filter(
          (o) => o.id !== selectOption.id
        ),
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

  function isSelected(id: string) {
    return answer
      ? answer.answerSelect.findIndex((a) => a.id === id) >= 0
      : question.defaultAnswerSelectOptions.findIndex((a) => a.id === id) >=
          0 || false;
  }

  return (
    <List>
      {question.selectOptions.map((s) => (
        <ListItem key={s.id}>
          <Checkbox
            checked={isSelected(s.id)}
            onChange={(e) => handleChange(e.target.checked, s)}
          />
          {!s.isOpen && <>{s.value}</>}
          {s.isOpen && (
            <TextField
              label={s.value}
              value={
                otherValues?.find((v) => v.selectOptionId === s.id)?.value || ""
              }
              onChange={(e) => {
                updateOtherValues(s.id, e.currentTarget.value);
              }}
            />
          )}
        </ListItem>
      ))}
    </List>
  );
}

