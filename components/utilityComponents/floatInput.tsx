import { isFloat } from "@/utils/utils";
import { FormControl, TextField } from "@mui/material";
import { useState, ChangeEvent, useEffect } from "react";

interface FloatInputProps {
  disabled?: boolean;
  value?: number;
  onChange: (value: number) => void;
}

export default function FloatInput({
  disabled,
  value,
  onChange,
}: FloatInputProps) {
  const [valueString, setValueString] = useState<string>(
    value?.toString() || ""
  );

  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _valueString = e.currentTarget.value;
    setValueString(_valueString);

    if (!_valueString.match("^[-]?[0-9]*[,|.]?[0-9]*$")) {
      setError("Bitte eine Zahl eingeben.");
      return;
    }

    if (_valueString.match("^[-]?[0-9]*[.|,]$")) return;

    if (isNaN(parseFloat(_valueString.replace(",", ".")))) {
      setError("");
      return;
    }

    const _value = parseFloat(_valueString.replace(",", "."));
    setError("");
    onChange(_value);
  }

  return (
    <FormControl>
      <TextField
        disabled={disabled}
        value={valueString.replace(".", ",")}
        onChange={handleChange}
        inputProps={{ inputMode: "decimal" }}
        error={error !== ""}
        helperText={error}
      />
    </FormControl>
  );
}

