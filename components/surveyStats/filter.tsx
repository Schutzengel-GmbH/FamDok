import { FullSurvey } from "@/types/prismaHelperTypes";
import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { QuestionType, SelectOption } from "@prisma/client";
import { useState } from "react";
import { Tabulator } from "react-tabulator/lib/types/TabulatorTypes"
import SelectOptionsComponent from "../editSurvey/scaleNamesComponent";
import DatePickerComponent from "../utilityComponents/datePickerComponent";

interface StatsFilterProps {
  filters: Tabulator.Filter[];
  survey: FullSurvey;
  onChange: (f: Tabulator.Filter[]) => void
}

export default function StatsFilter({ filters, survey, onChange }: StatsFilterProps) {

  function addFilter(filter: Tabulator.Filter) {
    onChange([...filters, filter])
  }

  function updateFilter(index: number, filter: Tabulator.Filter) {
    onChange(filters.map((f, i) => i === index ? filter : f))
  }

  function removeFilter(index: number) {
    onChange(filters.filter((f, i) => i !== index))
  }

  return <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
    <NewFilter survey={survey} onSave={f => addFilter(f)} />
    {filters?.map((f, i) => <Filter
      key={i}
      survey={survey}
      filter={f}
      onChange={changedFilter => { updateFilter(i, changedFilter) }}
      onDelete={() => removeFilter(i)}
    />)}
  </Box>
}

interface NewFilterProps {
  survey: FullSurvey;
  onSave: (filter: Tabulator.Filter) => void;
}

function NewFilter({ survey, onSave }: NewFilterProps) {
  const [filter, setFilter] = useState<Tabulator.Filter>({ field: "", type: "=", value: "" })

  return (
    <Box sx={{ display: "flex", gap: ".5rem" }}>
      <FormControl sx={{ width: "25%" }}>
        <InputLabel id="questionLabel">Frage</InputLabel>
        <Select
          labelId="questionLabel"
          label={"Frage"}
          value={filter.field}
          onChange={e => setFilter({ ...filter, field: e.target.value })}
        >
          {survey?.questions.map(q =>
            <MenuItem value={q.id}>{q.questionText}</MenuItem>
          )}
        </Select>
      </FormControl>

      <TypeSelect questionType={survey?.questions.find(q => q.id === filter.field)?.type} type={filter.type} onChange={t => setFilter({ ...filter, type: t })} />

      <ValueInput questionType={survey?.questions.find(q => q.id === filter.field)?.type} value={filter.value} onChange={value => setFilter({ ...filter, value: value })} />

      <Button onClick={() => onSave(filter)}><Add /></Button>
    </Box>
  )
}

interface FilterProps {
  filter: Tabulator.Filter;
  survey: FullSurvey;
  onChange: (filter: Tabulator.Filter) => void
  onDelete: () => void;
}

function Filter({ filter, survey, onChange, onDelete }: FilterProps) {

  return (
    <Box sx={{ display: "flex", gap: ".5rem" }}>
      <FormControl sx={{ width: "25%" }}>
        <InputLabel id="questionLabel">Frage</InputLabel>
        <Select
          labelId="questionLabel"
          label={"Frage"}
          value={filter.field}
          onChange={e => onChange({ ...filter, field: e.target.value })}
        >
          {survey?.questions.map(q =>
            <MenuItem value={q.id}>{q.questionText}</MenuItem>
          )}
        </Select>
      </FormControl>

      <TypeSelect questionType={survey?.questions.find(q => q.id === filter.field)?.type} type={filter.type} onChange={t => onChange({ ...filter, type: t })} />

      <ValueInput questionType={survey?.questions.find(q => q.id === filter.field)?.type} value={filter.value} onChange={value => onChange({ ...filter, value: value })} />

      <Button onClick={onDelete}><Remove /></Button>

    </Box>
  )
}

interface TypeSelectProps {
  questionType: QuestionType;
  type: Tabulator.FilterType;
  onChange: (type: Tabulator.FilterType) => void
}

function TypeSelect({ questionType, type, onChange }: TypeSelectProps) {

  let availableTypes: Tabulator.FilterType[] = [];

  switch (questionType) {
    case QuestionType.Text: availableTypes = ["like", "=", "!=", "starts"]; break;
    case QuestionType.Num:
    case QuestionType.Int: availableTypes = ["=", "!=", "<", "<=", ">=", ">"]; break;
    case QuestionType.Date: availableTypes = ["="]; break;
    case QuestionType.Select: availableTypes = ["in"]; break;
    case QuestionType.Bool: availableTypes = ["=", "!="]; break;
    case QuestionType.Scale: availableTypes = []; break;

  }

  return <FormControl sx={{ width: "25%" }}>
    <InputLabel id="filter">Filter</InputLabel>
    <Select
      labelId="filter"
      label="Filter"
      value={type}
      onChange={e => onChange(e.target.value as Tabulator.FilterType)}
    >
      {availableTypes.map(t => <MenuItem value={t}>{t}</MenuItem>)}
    </Select>
  </FormControl>

}

interface ValueInputProps {
  questionType: QuestionType;
  value: boolean | string | number | SelectOption[] | Date;
  onChange: (value: boolean | string | number | SelectOption[] | Date) => void;
}

function ValueInput({ questionType, value, onChange }: ValueInputProps) {

  switch (questionType) {
    case QuestionType.Text: return <TextField value={value} onChange={e => onChange(e.target.value)} />
    case QuestionType.Scale:
    case QuestionType.Num:
    case QuestionType.Int: return <TextField value={value} onChange={e => onChange(e.target.value)} type="number" />
    case QuestionType.Date: return <DatePickerComponent
      currentAnswer={value as Date}
      onChange={d => onChange(d)} />
    case QuestionType.Select: return <SelectOptionsComponent
      value={value as SelectOption[] || []} onChange={v => onChange(v as SelectOption[])} />
    case QuestionType.Bool: return <Checkbox value={value} onChange={e => onChange(e.target.checked)} />
  }
}
