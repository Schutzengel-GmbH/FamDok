import { DateFilter } from "@/components/myResponses/filter.t";
import { QuestionFilterProps } from "@/components/myResponses/questionFilter";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

export default function DateFilter({ filter, onChange }: QuestionFilterProps) {
  const [state, setState] = useState({
    earlierThan: false,
    laterThan: false,
  });

  const f = filter.filter as DateFilter;

  useEffect(() => {
    onChange({
      ...filter,
      filter: {
        match: f?.match,
        earlierThan: state.earlierThan ? f?.earlierThan : undefined,
        laterThan: state.laterThan ? f?.laterThan : undefined,
      } as DateFilter,
    });
  }, [state]);

  function handleChangeMatch(d: Date) {
    onChange({
      ...filter,
      filter: {
        match: d || null,
        earlierThan: null,
        laterThan: null,
      } as DateFilter,
    });
  }

  function handleChangeLaterThan(d: Date) {
    onChange({
      ...filter,
      filter: {
        match: null,
        laterThan: d || null,
        earlierThan: state.earlierThan ? f?.earlierThan : undefined,
      } as DateFilter,
    });
  }

  function handleChangeEarlierThan(d: Date) {
    onChange({
      ...filter,
      filter: {
        match: null,
        laterThan: state.laterThan ? f?.laterThan : undefined,
        earlierThan: d,
      } as DateFilter,
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
              checked={state.laterThan}
              onChange={(e) =>
                setState({ ...state, laterThan: e.target.checked })
              }
            />
          }
          label="Von..."
        />
        <FormControlLabel
          sx={{ gridColumn: 2 }}
          control={
            <Checkbox
              checked={state.earlierThan}
              onChange={(e) =>
                setState({ ...state, earlierThan: e.target.checked })
              }
            />
          }
          label="Bis..."
        />
        {state.laterThan && (
          <DatePicker
            sx={{ gridColumn: 1 }}
            value={f?.laterThan || null}
            onChange={handleChangeLaterThan}
          />
        )}
        {state.earlierThan && (
          <DatePicker
            sx={{ gridColumn: 2 }}
            value={f?.earlierThan || null}
            onChange={handleChangeEarlierThan}
          />
        )}
      </Box>
      {!state.earlierThan && !state.laterThan && (
        <DatePicker value={f?.match || null} onChange={handleChangeMatch} />
      )}
    </Box>
  );
}

