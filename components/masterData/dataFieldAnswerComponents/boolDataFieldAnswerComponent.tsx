import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function BoolDataFieldAnswerComponent({
  answer,
  dataField,
  canEdit,
  onChange,
}: DataFieldAnswerComponentProps) {
  function handleChange(e: any) {
    const ansValue = e.target.value == "true" ? true : false;
    if (ansValue === answer?.answerBool)
      onChange({ ...answer, answerBool: undefined, dataFieldId: dataField.id });
    else
      onChange({ ...answer, answerBool: ansValue, dataFieldId: dataField.id });
  }

  return (
    <FormControl disabled={!canEdit}>
      <RadioGroup onClick={handleChange}>
        <FormControlLabel
          key={0}
          value={"true"}
          control={<Radio checked={answer?.answerBool === true} />}
          label="Ja"
        />
        <FormControlLabel
          key={1}
          value={"false"}
          control={<Radio checked={answer?.answerBool === false} />}
          label="Nein"
        />
      </RadioGroup>
    </FormControl>
  );
}

