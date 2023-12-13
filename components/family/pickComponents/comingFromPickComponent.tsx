import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { ComingFromOption } from "@prisma/client";

type ComingFromOptionPickerProps = {
  comingFromOptions: ComingFromOption[];
  sx?: SxProps;
  optionId: string;
  onChange: (comingFrom: ComingFromOption) => void;
};

export default function ComingFromOptionPicker({
  comingFromOptions,
  sx,
  optionId,
  onChange,
}: ComingFromOptionPickerProps) {
  return (
    <FormControl sx={sx}>
      <Select
        label={"Zugang über"}
        value={optionId || " "}
        onChange={(e: SelectChangeEvent<string | undefined>) =>
          onChange(comingFromOptions.find((o) => o.id === e.target.value))
        }
      >
        {comingFromOptions.map((l) => (
          <MenuItem key={l.id} value={l.id}>
            {l.value}
          </MenuItem>
        ))}
        <MenuItem value={" "}>Keine Angabe/Unbekannt</MenuItem>
      </Select>
      <InputLabel>Zugang über</InputLabel>
    </FormControl>
  );
}
