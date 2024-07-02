import { FullQuestion } from "@/types/prismaHelperTypes";
import { Autocomplete, TextField } from "@mui/material";
import { Question, SelectOption } from "@prisma/client";

interface SelectOptionAutocompleteProps {
  question: FullQuestion;
  options: SelectOption[];
  onChange: (options: SelectOption[]) => void;
}

export default function SelectOptionAutocomplete({
  question,
  options,
  onChange,
}: SelectOptionAutocompleteProps) {
  const availableOptions = question.selectOptions;
  return (
    <Autocomplete
      fullWidth
      multiple
      renderInput={(params) => <TextField {...params} label="Optionen" />}
      options={availableOptions || []}
      getOptionLabel={(o) => o.value}
      onChange={(e, selectedUsers) => onChange(selectedUsers)}
      value={options || []}
      isOptionEqualToValue={(o, v) => o.id === v.id}
    />
  );
}

