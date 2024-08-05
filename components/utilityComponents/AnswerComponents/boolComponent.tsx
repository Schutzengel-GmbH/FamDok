import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

interface BoolComponentProps {
  row?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function BoolComponent({
  row,
  value,
  onChange,
}: BoolComponentProps) {
  const [stateValue, setStateValue] = useState(value);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let ansValue;
    switch (e.target.value) {
      case "true":
        ansValue = true;
        break;
      case "false":
        ansValue = false;
        break;
      default:
        ansValue = undefined;
        break;
    }
    setStateValue(ansValue);
    onChange(ansValue);
  }

  return (
    <FormControl>
      <RadioGroup
        sx={row ? { display: "flex", flexDirection: "row" } : undefined}
        onChange={handleChange}
      >
        <FormControlLabel
          key={0}
          value={"true"}
          control={<Radio checked={stateValue === true} />}
          label="Ja"
        />
        <FormControlLabel
          key={1}
          value={"false"}
          control={<Radio checked={stateValue === false} />}
          label="Nein"
        />
      </RadioGroup>
    </FormControl>
  );
}

