import { FormControl, SxProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export interface DatePickerComponentProps {
  label?: string | undefined;
  sx?: SxProps;
  currentAnswer: Date | undefined | null;
  onChange: (value: Date, error: boolean) => void;
}

export default function DatePickerComponent({
  sx,
  label,
  currentAnswer,
  onChange,
}: DatePickerComponentProps) {
  return (
    <FormControl sx={sx}>
      <DatePicker
        label={label || undefined}
        onChange={(date) => {
          if (date) onChange(date, false);
        }}
        value={currentAnswer ? new Date(currentAnswer) : undefined}
      />
    </FormControl>
  );
}
