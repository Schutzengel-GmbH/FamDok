import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { isFloat } from "@/utils/utils";
import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent, useEffect } from "react";

export default function NumDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const [valueString, setValueString] = useState<string>(
    answer ? answer.answerNum?.toString() : ""
  );

  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValueString(_valueString);

    if (!_valueString.match("^[0-9]*[,|.]?[0-9]*$")) {
      setError("Bitte eine Zahl eingeben.");
      return;
    }

    if (_valueString.match("[0-9]*[.|,]$")) return;

    if (isNaN(parseFloat(_valueString.replace(",", ".")))) {
      setError("");
      return;
    }

    const _value = parseFloat(_valueString.replace(",", "."));
    setError("");
    onChange({ ...answer, answerNum: _value, dataFieldId: dataField.id });
  }

  return (
    <FormControl>
      <TextField
        value={valueString.replace(".", ",")}
        onChange={handleChange}
        inputProps={{ inputMode: "decimal" }}
        error={error !== ""}
        helperText={error}
      />
    </FormControl>
  );
}
