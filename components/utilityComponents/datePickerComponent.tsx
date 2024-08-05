import { FormControl, SxProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

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
  const [date, setDate] = useState<Date>(
    currentAnswer ? new Date(currentAnswer) : null
  );

  return (
    <FormControl sx={sx}>
      <DatePicker
        label={label || undefined}
        onChange={(d) => {
          setDate(d);
          onChange(d, false);
        }}
        value={date}
      />
    </FormControl>
  );
}
