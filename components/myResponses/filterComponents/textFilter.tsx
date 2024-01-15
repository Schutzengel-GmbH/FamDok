import { TextFilter } from "@/components/myResponses/filter.t";
import { QuestionFilterProps } from "@/components/myResponses/questionFilter";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { ChangeEvent } from "react";

export default function TextFilter({ filter, onChange }: QuestionFilterProps) {
  const f = filter.filter as TextFilter;

  function handleChangeText(e: ChangeEvent<HTMLInputElement>) {
    if (!f)
      onChange({
        ...filter,
        filter: {
          caseSensitive: false,
          filterText: e.target.value,
          onlyFullMatch: false,
        },
      });
    else
      onChange({
        ...filter,
        filter: { ...filter.filter, filterText: e.target.value },
      });
  }

  function handleCase(e: ChangeEvent<HTMLInputElement>) {
    if (!f)
      onChange({
        ...filter,
        filter: {
          caseSensitive: e.target.checked,
          filterText: "",
          onlyFullMatch: false,
        },
      });
    else
      onChange({
        ...filter,
        filter: {
          ...filter.filter,
          caseSensitive: e.target.checked,
        },
      });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <FormControlLabel
        control={
          <Checkbox checked={f?.caseSensitive || false} onChange={handleCase} />
        }
        label="Groß- und Kleinschreibung beachten"
      />
      <TextField value={f?.filterText || ""} onChange={handleChangeText} />
    </Box>
  );
}

