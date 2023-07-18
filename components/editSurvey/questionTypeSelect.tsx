import { MenuItem, Select } from "@mui/material";
import { QuestionType } from "@prisma/client";
import { getQuestionTypeString } from "@/utils/utils";

export interface QuestionTypeSelectProps {
  value: QuestionType;
  onChange: (e: QuestionType) => void;
}

export default function QuestionTypeSelect({
  value,
  onChange,
}: QuestionTypeSelectProps) {
  let options: JSX.Element[] = [];
  for (const type in QuestionType) {
    options.push(
      <MenuItem key={type} value={type}>
        {getQuestionTypeString(type as QuestionType)}
      </MenuItem>
    );
  }
  return (
    <Select
      sx={{ mt: ".5rem" }}
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionType)}
    >
      {options}
    </Select>
  );
}
