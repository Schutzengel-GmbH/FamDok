import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { isFloat, isInt } from "@/utils/utils";
import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent } from "react";

export default function NumDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const [valueString, setValueString] = useState(
    answer ? answer.answerInt?.toString() : undefined
  );
  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValueString(_valueString);

    if (_valueString && !isFloat(_valueString)) {
      setError("Bitte eine Zahl eingeben.");
      return;
    }

    const _value = parseFloat(_valueString);

    setError("");
    onChange({ ...answer, answerNum: _value, dataFieldId: dataField.id });
  }

  return (
    <FormControl>
      <TextField
        value={valueString}
        onChange={handleChange}
        error={error !== ""}
        helperText={error}
        inputProps={{ inputMode: "numeric" }}
      />
    </FormControl>
  );
}
