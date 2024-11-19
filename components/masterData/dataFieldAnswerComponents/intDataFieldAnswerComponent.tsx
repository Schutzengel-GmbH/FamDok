import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { InputErrors } from "@/components/response/answerQuestion";
import { isInt } from "@/utils/utils";
import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent, useEffect } from "react";

export default function IntDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const [valueString, setValueString] = useState(
    answer ? answer.answerInt?.toString() : ""
  );
  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValueString(_valueString);

    if (_valueString && !isInt(_valueString)) {
      setError("Bitte eine ganze Zahl eingeben.");

      return;
    }

    if (
      Number(_valueString) > 2147483647 ||
      Number(_valueString) < -2147483647
    ) {
      setError("Zahl ist zu groß oder zu klein für 32bit-signed-Integer");

      return;
    }

    const _value = parseInt(_valueString);

    setError("");
    onChange({ ...answer, answerInt: _value, dataFieldId: dataField.id });
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
