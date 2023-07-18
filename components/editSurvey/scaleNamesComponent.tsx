import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useEffect, useState } from "react";

export type SelectOptionState = Partial<SelectOption> & {
  updated?: boolean;
  delete?: boolean;
  create?: boolean;
};

export interface ScaleNamesComponentProps {
  value: SelectOptionState[];
  onChange: (selectOptions: { value: string }[]) => void;
}

export default function ScaleNamesComponent({
  value,
  onChange,
}: ScaleNamesComponentProps) {
  const [selectOptionsState, updateState] =
    useState<SelectOptionState[]>(value);

  useEffect(
    () =>
      onChange(
        selectOptionsState
          .filter((o) => !o.delete)
          .map((o) => ({ value: o.value || "" }))
      ),
    //! Maybe look into this more, but it looks like I should ignore this warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectOptionsState]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography>
        <strong>Schritte und Bezeichnung:</strong>
      </Typography>
      {selectOptionsState.map((option, i) => (
        <TextField
          key={i}
          value={option.value}
          onChange={(e) => {
            updateState(
              selectOptionsState.map((s, index) => {
                if (index === i)
                  return { ...s, value: e.currentTarget.value, updated: true };
                return s;
              })
            );
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  updateState(
                    selectOptionsState.map((s, index) => {
                      if (index === i) return { ...s, delete: !s.delete };
                      return s;
                    })
                  );
                }}
              >
                <Delete
                  color={selectOptionsState[i].delete ? "warning" : "secondary"}
                />
              </IconButton>
            ),
          }}
        />
      ))}

      <Button
        onClick={() => {
          updateState([...selectOptionsState, { value: "", create: true }]);
        }}
      >
        <Add />
      </Button>
    </Box>
  );
}
