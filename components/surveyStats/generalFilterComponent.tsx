import UserSelectId from "@/components/surveyStats/userSelectId";
import { FullSurvey } from "@/types/prismaHelperTypes";
import {
  DateFilters,
  FilterType,
  IFilter,
  IGeneralFilter,
  TextFilters,
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

interface GeneralFilterProps {
  survey: FullSurvey;
  generalFilter: IGeneralFilter;
  onChange: (generalFilter: IGeneralFilter) => void;
}

export default function GeneralFilterComponent({
  survey,
  generalFilter,
  onChange,
}: GeneralFilterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: ".5rem",
        width: "100%",
      }}
    >
      <SelectField
        generalFilter={generalFilter}
        onChange={(f) => onChange({ field: f.field })}
      />
      <SelectFilter
        generalFilter={generalFilter}
        onChange={(f) => onChange({ ...generalFilter, filter: f.filter })}
      />
      <ValueInput
        generalFilter={generalFilter}
        onChange={(f) => onChange({ ...generalFilter, value: f.value })}
      />
    </Box>
  );
}

function SelectField({ generalFilter, onChange }: GeneralFilterSelectProps) {
  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="fieldLabel">Eigenschaft</InputLabel>
      <Select
        labelId="fieldLabel"
        label={"Eigenschaft"}
        value={generalFilter?.field || ""}
        onChange={(e) => onChange({ ...generalFilter, field: e.target.value })}
      >
        <MenuItem key={0} value={"responseCreatedBy"}>
          Erstellt von
        </MenuItem>
        <MenuItem key={1} value={"responseCreatedAt"}>
          Erstellt am
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function SelectFilter({ generalFilter, onChange }: GeneralFilterSelectProps) {
  function availableFilters(
    field: "responseCreatedBy" | "responseCreatedAt"
  ): IFilter[] {
    switch (field) {
      case "responseCreatedBy":
        return [];
      case "responseCreatedAt":
        return DateFilters;
      default:
        return [];
    }
  }

  if (availableFilters(generalFilter?.field).length < 1) return <></>;

  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="fieldLabel">Filter</InputLabel>
      <Select
        labelId="fieldLabel"
        label={"Filter"}
        value={generalFilter?.filter || ""}
        onChange={(e) =>
          onChange({ ...generalFilter, filter: e.target.value as FilterType })
        }
      >
        {availableFilters(generalFilter?.field).map((f) => (
          <MenuItem key={f.filter} value={f.filter}>
            {f.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function ValueInput({ generalFilter, onChange }: GeneralFilterSelectProps) {
  switch (generalFilter?.field) {
    case "responseCreatedAt":
      return (
        <DatePicker
          value={generalFilter.value}
          onChange={(d) => {
            onChange({ ...generalFilter, value: d });
          }}
        />
      );
    case "responseCreatedBy":
      return (
        <UserSelectId
          sx={{ width: "60%" }}
          userId={generalFilter.value}
          onChange={(id) => onChange({ ...generalFilter, value: id })}
        />
      );
    default:
      return <></>;
  }
}

interface GeneralFilterSelectProps {
  generalFilter: IGeneralFilter;
  onChange: (IGeneralFilter) => void;
}

