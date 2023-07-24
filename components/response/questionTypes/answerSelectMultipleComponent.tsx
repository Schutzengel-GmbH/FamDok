import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import { TextField, Checkbox, List, ListItem } from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useState } from "react";

export default function AnswerSelectMultipleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer.answerSelectOtherValues as IAnswerSelectOtherValues) || []
  );

  function handleChange(checked: boolean, selectOption: SelectOption) {
    const selectOptions = answer?.answerSelect || [];
    const indexOfOption = selectOptions.findIndex(
      (o) => selectOption.id === o.id
    );

    if (checked) selectOptions.push(selectOption);
    if (!checked) selectOptions.splice(indexOfOption, 1);

    onChange({ ...answer, answerSelect: selectOptions });
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
