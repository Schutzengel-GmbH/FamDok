import { NumberFilter } from "@/components/myResponses/filter.t";
import { QuestionFilterProps } from "@/components/myResponses/questionFilter";
import { Box, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

export default function NumFilter({ filter, onChange }: QuestionFilterProps) {
  const [state, setState] = useState({
    filterMax: false,
    filterMin: false,
  });

  const f = filter.filter as NumberFilter;

  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...filter,
      filter: {
        filterValue: parseInt(e.target.value) || null,
        filterMin: null,
        filterMax: null,
      } as NumberFilter,
    });
  }

  function handleChangeMin(e: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...filter,
      filter: {
        filterValue: null,
        filterMin: parseInt(e.target.value) || null,
        filterMax: f?.filterMax,
      } as NumberFilter,
    });
  }

  function handleChangeMax(e: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...filter,
      filter: {
        filterValue: null,
        filterMin: f?.filterMin,
        filterMax: parseInt(e.target.value),
      } as NumberFilter,
    });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Box
        sx={{
          display: "grid",
        }}
      >
        <FormControlLabel
          sx={{ gridColumn: 1 }}
          control={
            <Checkbox
              checked={state.filterMin}
              onChange={(e) =>
                setState({ ...state, filterMin: e.target.checked })
              }
            />
          }
          label="Von..."
        />
        <FormControlLabel
          sx={{ gridColumn: 2 }}
          control={
            <Checkbox
              checked={state.filterMax}
              onChange={(e) =>
                setState({ ...state, filterMax: e.target.checked })
              }
            />
          }
          label="Bis..."
        />
        {state.filterMin && (
          <TextField
            value={f?.filterMin || null}
            onChange={handleChangeMin}
            sx={{ gridColumn: 1 }}
          />
        )}
        {state.filterMax && (
          <TextField
            value={f?.filterMax || null}
            onChange={handleChangeMax}
            sx={{ gridColumn: 2 }}
          />
        )}
      </Box>
      {!state.filterMax && !state.filterMin && (
        <TextField
          value={f?.filterValue || null}
          onChange={handleChangeValue}
        />
      )}
    </Box>
  );
}

