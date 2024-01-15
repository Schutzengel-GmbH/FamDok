import { SelectFilter } from "@/components/myResponses/filter.t";
import { QuestionFilterProps } from "@/components/myResponses/questionFilter";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import { SelectOption } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export default function SelectFilter({
  filter,
  onChange,
}: QuestionFilterProps) {
  const f = filter.filter as SelectFilter;
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  function handleChangeSelection(id: string, e: ChangeEvent<HTMLInputElement>) {
    let newOptions = [];
    if (e.target.checked) {
      newOptions = [
        ...selectedOptions,
        filter.question.selectOptions.find((o) => o.id === id),
      ];
    } else {
      newOptions = [...selectedOptions].filter((o) => o.id !== id);
    }
    setSelectedOptions(newOptions);
    if (f?.anyOf)
      onChange({
        ...filter,
        filter: { ...filter.filter, anyOf: newOptions },
      });
    if (f?.exactMatch)
      onChange({
        ...filter,
        filter: { ...filter.filter, exactMatch: newOptions },
      });
    if (f?.not)
      onChange({
        ...filter,
        filter: { ...filter.filter, not: newOptions },
      });
  }

  function handleMode(e: ChangeEvent<HTMLInputElement>) {
    switch (e.target.value) {
      case "anyOf":
        onChange({
          ...filter,
          filter: {
            anyOf: selectedOptions,
            not: undefined,
            exactMatch: undefined,
          } as SelectFilter,
        });
        break;
      case "exactMatch":
        onChange({
          ...filter,
          filter: {
            anyOf: undefined,
            not: undefined,
            exactMatch: selectedOptions,
          } as SelectFilter,
        });
        break;
      case "not":
        onChange({
          ...filter,
          filter: {
            anyOf: undefined,
            not: selectedOptions,
            exactMatch: undefined,
          } as SelectFilter,
        });
        break;
      default:
        onChange({
          ...filter,
          filter: {
            anyOf: undefined,
            not: undefined,
            exactMatch: undefined,
          } as SelectFilter,
        });
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <RadioGroup
          sx={{ display: "flex", flexDirection: "row" }}
          onChange={handleMode}
        >
          <FormControlLabel
            key={0}
            value={"anyOf"}
            control={<Radio checked={f?.anyOf !== undefined} />}
            label="Mind. einer"
          />
          <FormControlLabel
            key={1}
            value={"exactMatch"}
            control={<Radio checked={f?.exactMatch !== undefined} />}
            label="Genau"
          />
          {/* <FormControlLabel
            key={3}
            value={"not"}
            control={<Radio checked={f?.not !== undefined} />}
            label="Nicht"
          /> */}
        </RadioGroup>
      </Box>
      <List>
        {filter.question.selectOptions.map((o) => (
          <ListItem key={o.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    selectedOptions.find((s) => s.id === o.id) !== undefined
                  }
                  onChange={(e) => handleChangeSelection(o.id, e)}
                />
              }
              label={o.value}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

