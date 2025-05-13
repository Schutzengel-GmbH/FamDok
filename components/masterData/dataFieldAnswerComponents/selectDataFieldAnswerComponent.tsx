import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DataFieldSelectOption } from "@prisma/client";
import { useEffect, useState } from "react";

export default function SelectDataFieldAnswerComponent({
  answer,
  dataField,
  canEdit,
  onChange,
}: DataFieldAnswerComponentProps) {
  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer?.selectOtherValues as IAnswerSelectOtherValues) || [],
  );

  useEffect(() => {
    setOtherValues(
      (answer?.selectOtherValues as IAnswerSelectOtherValues) || [],
    );
  }, [answer]);

  const optionChecked = (selectOption: DataFieldSelectOption) => {
    return (
      answer?.answerSelect.find((s) => selectOption.id === s.id) !== undefined
    );
  };

  const handleChangeMultiple = (
    checked: boolean,
    selectOption: DataFieldSelectOption,
  ) => {
    if (checked) {
      if (answer)
        onChange({
          ...answer,
          answerSelect: [...answer.answerSelect, selectOption],
        });
      else
        onChange({
          dataFieldId: dataField.id,
          answerSelect: [selectOption],
        });
    } else {
      if (answer)
        onChange({
          ...answer,
          answerSelect: answer.answerSelect.filter(
            (o) => o.id !== selectOption.id,
          ),
        });
      else
        onChange({
          dataFieldId: dataField.id,
          answerSelect: answer.answerSelect.filter(
            (o) => o.id !== selectOption.id,
          ),
        });
    }
  };

  const handleOtherValueChange = (
    o: Partial<DataFieldSelectOption>,
    value: string,
  ) => {
    const index = otherValues.findIndex((ov) => ov.selectOptionId === o.id);
    let newValues = otherValues;
    if (index > -1) {
      newValues[index] = { selectOptionId: o.id, value };
      setOtherValues(newValues);
    } else {
      newValues.push({ selectOptionId: o.id, value });
      setOtherValues([...otherValues, { selectOptionId: o.id, value }]);
    }
    onChange({ ...answer, selectOtherValues: newValues });
  };

  return dataField.selectMultiple ? (
    <List>
      {dataField.selectOptions.map((o: DataFieldSelectOption) => {
        return (
          <ListItem key={o.id}>
            <Checkbox
              disabled={!canEdit}
              checked={optionChecked(o)}
              onChange={(e) => handleChangeMultiple(e.target.checked, o)}
            />
            {o.isOpen ? (
              <TextField
                value={
                  otherValues.find((ov) => {
                    console.log(ov);
                    return ov.selectOptionId === o.id;
                  })?.value || ""
                }
                onChange={(e) => handleOtherValueChange(o, e.target.value)}
                disabled={!optionChecked(o) || !canEdit}
              />
            ) : (
              <>{o.value}</>
            )}
          </ListItem>
        );
      })}
    </List>
  ) : (
    <FormControl>
      <RadioGroup
        sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
      >
        {dataField.selectOptions.map((o: DataFieldSelectOption) => (
          <FormControlLabel
            key={o.id}
            control={
              <Radio
                checked={optionChecked(o)}
                disabled={!canEdit}
                onClick={() => {
                  onChange({
                    ...answer,
                    answerSelect: [o],
                    dataFieldId: dataField.id,
                  });
                }}
              />
            }
            label={
              o.isOpen ? (
                <TextField
                  value={
                    otherValues.find((ov) => ov.selectOptionId === o.id)
                      ?.value || ""
                  }
                  onChange={(e) => handleOtherValueChange(o, e.target.value)}
                  disabled={!optionChecked(o) || !canEdit}
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
