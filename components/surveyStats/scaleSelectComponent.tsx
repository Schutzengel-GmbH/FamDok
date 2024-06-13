import { FullQuestion } from "@/types/prismaHelperTypes";
import { Slider } from "@mui/material";
import { SelectOption } from "@prisma/client";

interface ScaleSelectComponentProps {
  question: FullQuestion;
  value: SelectOption[];
  onChange: (ids: SelectOption[]) => void;
}

export default function ScaleSelect({
  question,
  value,
  onChange,
}: ScaleSelectComponentProps) {
  const rangeLow = value
    ? question.selectOptions.findIndex((o) => value[0].id === o.id)
    : 0;
  const rangeHigh = value
    ? question.selectOptions.findIndex(
        (o) => value[value.length - 1].id === o.id
      )
    : question.selectOptions.length - 1;

  const marks = question.selectOptions.map((o, i) => ({
    value: i,
    label: o.value,
  }));

  function handleChange(e: Event, newValue: number[]) {
    onChange(
      question.selectOptions.filter(
        (o, i) => i <= newValue[1] && i >= newValue[0]
      )
    );
  }

  return (
    <Slider
      value={[rangeLow, rangeHigh]}
      onChange={handleChange}
      min={0}
      max={marks.length - 1}
      marks={marks}
    />
  );
}

