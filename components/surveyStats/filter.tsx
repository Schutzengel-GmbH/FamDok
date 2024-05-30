import { FullSurvey } from "@/types/prismaHelperTypes";
import { BooleanFilters, DateFilters, IFilter, NumberFilters, TextFilters } from "@/utils/filterLogic";
import { Add, Remove } from "@mui/icons-material";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { QuestionType } from "@prisma/client";
import { useState } from "react";

interface StatsFilterProps {
  filters: ReadyFilter[];
  onChange: (filters: ReadyFilter[]) => void
  survey: FullSurvey;
}

export type ReadyFilter = { field: string, filter: IFilter<any, any>, filterParams?: any }

export default function StatsFilter({ filters, onChange, survey }: StatsFilterProps) {
  const [newFilter, setNewFilter] = useState<Partial<ReadyFilter>>({})

  function addFilter() {
    if (!filters) onChange([newFilter as ReadyFilter]);
    else onChange([...filters, newFilter as ReadyFilter])
  }

  function removeFilter(index: number) {
    onChange(filters.filter((f, i) => i !== index))
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>

      <Box sx={{ display: "flex", flexDirection: "row", gap: ".5rem" }}>
        <FormControl sx={{ width: "25%" }}>
          <InputLabel id="questionLabel">Frage</InputLabel>
          <Select
            labelId="questionLabel"
            label={"Frage"}
            value={newFilter.field}
            onChange={e => setNewFilter({ ...newFilter, field: e.target.value })}
          >
            {survey?.questions.map(q =>
              <MenuItem value={q.id}>{q.questionText}</MenuItem>
            )}
          </Select>
        </FormControl>

        <FilterSelect
          questionType={survey?.questions?.find(q => q.id === newFilter.field)?.type}
          filter={newFilter.filter}
          onChange={f => setNewFilter({ ...newFilter, filter: f })}
        />

        <FilterParams
          questionType={survey?.questions?.find(q => q.id === newFilter.field)?.type}
          filter={newFilter.filter}
          params={newFilter.filterParams}
          onChange={p => setNewFilter({ ...newFilter, filterParams: p })}
        />

        <Button onClick={addFilter}><Add /></Button>

      </Box>
      {filters?.map((filter, index) => {

        return (
          <Box sx={{ display: "flex", flexDirection: "row", gap: ".5rem" }}>
            <FormControl sx={{ width: "25%" }}>
              <InputLabel id="questionLabel">Frage</InputLabel>
              <Select
                labelId="questionLabel"
                label={"Frage"}
                value={filter.field}
                onChange={e => onChange(filters.map((f, i) => i === index ? { ...filter, field: e.target.value } : f))}
              >
                {survey?.questions.map(q =>
                  <MenuItem value={q.id}>{q.questionText}</MenuItem>
                )}
              </Select>
            </FormControl>

            <FilterSelect
              questionType={survey?.questions?.find(q => q.id === filter.field)?.type}
              filter={filter.filter}
              onChange={f => onChange(filters.map((fi, i) => i === index ? { ...filter, filter: f } : fi))}
            />

            <FilterParams
              questionType={survey?.questions?.find(q => q.id === filter.field)?.type}
              filter={filter.filter}
              params={filter.filterParams}
              onChange={p => onChange(filters.map((fi, i) => i === index ? { ...filter, filterParams: p } : fi))}
            />

            <Button onClick={() => removeFilter(index)}><Remove /></Button>
          </Box>)
      })}
    </Box>
  )
}

interface FilterSelectProps {
  questionType: QuestionType
  filter: IFilter<any, any>;
  onChange: (filter: IFilter<any, any>) => void
}

function FilterSelect({ questionType, filter, onChange }: FilterSelectProps) {

  let availableFilters: IFilter<any, any>[] = [];

  switch (questionType) {
    case QuestionType.Text: availableFilters = TextFilters; break;
    case QuestionType.Num:
    case QuestionType.Int: availableFilters = NumberFilters; break;
    case QuestionType.Date: availableFilters = DateFilters; break;
    case QuestionType.Select: break;
    case QuestionType.Bool: availableFilters = BooleanFilters; break;
    case QuestionType.Scale: break;
  }

  return <FormControl sx={{ width: "25%" }}>
    <InputLabel id="filterLabel">Filter</InputLabel>
    <Select
      labelId="filterLabel"
      label={"Filter"}
      value={filter?.name || null}
      onChange={e => onChange(availableFilters.find(f => f.name === e.target.value))}
    >
      {availableFilters.map(f => <MenuItem value={f.name}>{f.text}</MenuItem>)}
    </Select>
  </FormControl>
}

interface FilterParamsProps {
  questionType: QuestionType,
  filter: IFilter<any, any>,
  params: any,
  onChange: (params: any) => void
}

function FilterParams({ questionType, filter, params, onChange }: FilterParamsProps) {

  switch (questionType) {
    case QuestionType.Text: return <TextField value={params?.compareString} onChange={e => onChange({ compareString: e.target.value })} />
    case QuestionType.Num:
    case QuestionType.Int: return <TextField value={params?.compareNumber} onChange={e => onChange({ compareNumber: Number(e.target.value) })} type="number" />
    case QuestionType.Date:
      return filter.name === "range"
        ? <Box sx={{ display: "flex", flexDirection: "row", gap: ".5rem" }}>
          <DatePicker value={params?.start} onChange={d => onChange({ ...params, start: d })} />
          <DatePicker value={params?.end} onChange={d => onChange({ ...params, end: d })} />
        </Box>
        : <DatePicker value={params?.compareDate} onChange={d => onChange({ compareDate: d })} />
    case QuestionType.Select: return <>NOT IMPLEMENTED</>
    case QuestionType.Bool: return <></>
    case QuestionType.Scale: return <>NOT IMPLEMENTED</>
  }
}