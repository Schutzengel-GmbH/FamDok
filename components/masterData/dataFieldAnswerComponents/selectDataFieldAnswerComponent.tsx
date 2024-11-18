import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { FullDataFieldSelectOption } from "@/types/prismaHelperTypes";
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

export default function SelectDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const optionChecked = (selectOption: FullDataFieldSelectOption) => {
    console.log(answer.answerSelect);
    return (
      answer?.answerSelect.find((s) => selectOption.id === s.id) !== undefined
    );
  };

  const handleChangeMultiple = (
    checked: boolean,
    selectOption: FullDataFieldSelectOption
  ) => {
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
  };

  const textFieldValue = (o: Partial<FullDataFieldSelectOption>) =>
    answer?.answerSelect
      ?.find((so) => so.id === o.id)
      ?.dataFieldSelectOtherOption?.find(
        (oo) =>
          oo.dataFieldSelectOptionId === o.id &&
          oo.dataFieldAnswerId === answer.id
      ).value || "";

  const handleOtherTextChange = (
    o: Partial<FullDataFieldSelectOption>,
    value: string
  ) => {
    if (textFieldValue(o)) {
    } else {
    }
  };

  return dataField.selectMultiple ? (
    <List>
      {dataField.selectOptions.map((o) => (
        <ListItem key={o.id}>
          <Checkbox
            checked={optionChecked(o)}
            onChange={(e) => handleChangeMultiple(e.target.checked, o)}
          />
          {o.isOpen ? (
            <TextField
              value={textFieldValue(o)}
              onChange={(e) => handleOtherTextChange(o, e.target.value)}
              disabled={!optionChecked(o)}
            />
          ) : (
            <>{o.value}</>
          )}
        </ListItem>
      ))}
    </List>
  ) : (
    <FormControl>
      <RadioGroup
        sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
      >
        {dataField.selectOptions.map((o) => (
          <FormControlLabel
            key={o.id}
            control={
              <Radio
                checked={optionChecked(o)}
                onClick={() => {
                  onChange({
                    ...answer,
                    answerSelect: [{ ...o, dataFieldSelectOtherOption: [] }],
                    dataFieldId: dataField.id,
                  });
                }}
              />
            }
            label={o.isOpen ? "???" : o.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
