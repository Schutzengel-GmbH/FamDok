import ScaleItemComponent from "@/components/response/questionTypes/scaleItemComponent";
import ScaleSelect from "@/components/surveyStats/scaleSelectComponent";
import SelectOptionAutocomplete from "@/components/surveyStats/selectOptionAutocomplete";
import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Question, QuestionType } from "@prisma/client";

interface FilterComponentProps {
  survey: FullSurvey;
  filter: IFilter;
  onChange: (filter: IFilter) => void;
}

export default function FilterComponent({
  survey,
  filter,
  onChange,
}: FilterComponentProps) {
  const question = survey?.questions.find((q) => q.id === filter?.questionId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: ".5rem",
        width: "80%",
      }}
    >
      <SelectQuestion
        survey={survey}
        question={question}
        onChange={(q) => onChange({ ...filter, questionId: q.id })}
      />
      <SelectFilter
        questionType={question?.type}
        filter={filter}
        onChange={(f, v) =>
          onChange({ ...filter, filter: f.filter, value: v ? v : filter.value })
        }
      />
      <ValueInput
        question={question}
        filter={filter}
        onChange={(f) => onChange({ ...filter, value: f.value })}
      />
    </Box>
  );
}

interface SelectQuestionProps {
  survey: FullSurvey;
  question: Question;
  onChange: (question: Question) => void;
}

function SelectQuestion({ survey, question, onChange }: SelectQuestionProps) {
  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Frage</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Frage"}
        value={question?.id || ""}
        onChange={(e) =>
          onChange(survey.questions.find((q) => q.id === e.target.value))
        }
      >
        {survey?.questions.map((q) => (
          <MenuItem key={q.id} value={q.id}>
            {q.questionText}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function SelectFilter({ questionType, filter, onChange }: SelectFilterProps) {
  const filters = getFiltersForQuestionType(questionType);

  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Filter</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Filter"}
        value={filter?.filter || filters[0]?.filter || ""}
        onChange={(e) => {
          let filterToUse = filters.find((f) => f.filter === e.target.value);
          if (filterToUse.value === undefined) onChange(filterToUse);
          else onChange(filterToUse, filterToUse.value);
        }}
      >
        {filters.map((f) => (
          <MenuItem key={f.filter} value={f.filter}>
            {f.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface ValueInputProps {
  question: FullQuestion;
  filter: IFilter;
  onChange: (filter: IFilter) => void;
}

function ValueInput({ question, filter, onChange }: ValueInputProps) {
  switch (question?.type) {
    case "Text":
      return (
        <TextField
          value={filter.value}
          onChange={(e) =>
            onChange({ ...filter, value: e.target.value || undefined })
          }
        />
      );
    case "Int":
    case "Num":
      return (
        <TextField
          type={"number"}
          value={filter.value}
          onChange={(e) =>
            onChange({ ...filter, value: Number(e.target.value) })
          }
        />
      );
    case "Date":
      return (
        <DatePicker
          value={filter.value}
          onChange={(d) => {
            onChange({ ...filter, value: d });
          }}
        />
      );
    case "Bool":
      return <></>;
    case "Select":
      return (
        <SelectOptionAutocomplete
          question={question}
          options={filter.value}
          onChange={(o) => onChange({ ...filter, value: o })}
        />
      );
    case "Scale":
      return (
        <ScaleSelect
          question={question}
          value={filter.value}
          onChange={(v) => onChange({ ...filter, value: v })}
        />
      );

    default:
      return <></>;
  }
}

// Helper functions, types and interfaces

export interface IFilter {
  name: string;
  filter:
    | "equals"
    | "contains"
    | "not"
    | "in"
    | "notIn"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "startsWith"
    | "endsWith";
  questionId?: string;
  value?: any;
}

const TextFilters: IFilter[] = [
  { filter: "equals", name: "Gleich" },
  { filter: "contains", name: "Enthält" },
  { filter: "endsWith", name: "Endet auf" },
  { filter: "startsWith", name: "Beginnt mit" },
];
const BoolFilters: IFilter[] = [
  { filter: "equals", name: "Ja", value: true },
  { filter: "not", name: "Nein", value: true },
];
const DateFilters: IFilter[] = [
  { filter: "gt", name: "Ist nach" },
  { filter: "gte", name: "Ist nach oder am" },
  { filter: "lt", name: "Ist vor" },
  { filter: "lte", name: "Ist vor oder am" },
  { filter: "equals", name: "Am" },
  { filter: "not", name: "Nicht am" },
];
const NumberFilters: IFilter[] = [
  { filter: "gt", name: "Größer als" },
  { filter: "gte", name: "Größer oder gleich" },
  { filter: "lt", name: "Kleiner als" },
  { filter: "lte", name: "Kleiner oder gleich" },
  { filter: "equals", name: "Ist gleich" },
  { filter: "not", name: "Ist nicht gleich" },
];
const SelectFilters: IFilter[] = [
  { filter: "in", name: "Enthält mindestens einen von" },
];
const ScaleFilters: IFilter[] = [
  { filter: "in", name: "Innerhalb des Intervalls" },
  { filter: "notIn", name: "Außerhalb des Intervalls" },
];

function getFiltersForQuestionType(questionType: QuestionType) {
  let filters = [];

  switch (questionType) {
    case "Text":
      filters = TextFilters;
      break;
    case "Bool":
      filters = BoolFilters;
      break;
    case "Int":
      filters = NumberFilters;
      break;
    case "Num":
      filters = NumberFilters;
      break;
    case "Select":
      filters = SelectFilters;
      break;
    case "Date":
      filters = DateFilters;
      break;
    case "Scale":
      filters = ScaleFilters;
      break;
  }

  return filters;
}

interface SelectFilterProps {
  questionType: QuestionType;
  filter: IFilter;
  onChange: (filter: IFilter, value?: any) => void;
}

