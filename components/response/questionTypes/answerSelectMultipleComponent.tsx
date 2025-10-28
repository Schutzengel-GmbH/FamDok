import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import {
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useState } from "react";

export default function AnswerSelectMultipleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer?.answerSelectOtherValues as IAnswerSelectOtherValues) || []
  );

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

  function handleChange(_e, options: RecursivePartial<SelectOption>[]) {
    onChange({ ...answer, answerSelect: options });
  }

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={2}
      options={question.selectOptions}
      getOptionLabel={(o) => o.value}
      value={answer.answerSelect}
      onChange={handleChange}
      isOptionEqualToValue={(v1, v2) => v1.id === v2.id}
      renderInput={(params) => (
        <TextField {...params} label={question.questionText} />
      )}
    />
  );
}
