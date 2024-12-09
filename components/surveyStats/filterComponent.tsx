import ScaleSelect from "@/components/surveyStats/scaleSelectComponent";
import SelectOptionAutocomplete from "@/components/surveyStats/selectOptionAutocomplete";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import {
  IFilter,
  SelectFilterProps,
  getFiltersForQuestionType,
} from "@/utils/filters";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Question } from "@prisma/client";

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
        width: "100%",
      }}
    >
      <SelectQuestion
        survey={survey}
        question={question}
        onChange={(q) => onChange({ questionId: q.id })}
      />
      <SelectFilter
        question={question}
        filter={filter}
        onChange={(f, v) =>
          onChange({
            ...filter,
            filter: f.filter,
            value: v ? v : filter.value,
          })
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

function SelectFilter({ question, filter, onChange }: SelectFilterProps) {
  const filters = getFiltersForQuestionType(question, question?.selectMultiple);

  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Filter</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Filter"}
        value={filter?.filter || ""}
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
  if (filter?.filter === "empty" || filter?.filter === "notEmpty") return <></>;

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
          type="text"
          value={filter.value || ""}
          onChange={(e) => {
            const number = Number(e.target.value);
            if (Number.isNaN(number)) return;
            onChange({ ...filter, value: number });
          }}
        />
      );
    case "Date":
      return (
        <DatePickerComponent
          currentAnswer={filter.value}
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

