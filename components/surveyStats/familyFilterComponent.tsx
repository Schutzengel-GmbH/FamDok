import survey from "@/pages/api/surveys/[survey]";
import { FullSurvey } from "@/types/prismaHelperTypes";
import {
  BoolFilters,
  DateFilters,
  FilterType,
  IFamilyFilter,
  IFilter,
  NumberFilters,
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

interface FamilyFilterProps {
  survey: FullSurvey;
  familyFilter: IFamilyFilter;
  onChange: (familyFilter: IFamilyFilter) => void;
}

export default function FamilyFilterComponent({
  survey,
  familyFilter,
  onChange,
}: FamilyFilterProps) {
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
        familyFilter={familyFilter}
        onChange={(f) => onChange({ field: f.field })}
      />
      <SelectFilter
        familyFilter={familyFilter}
        onChange={(f) => onChange({ ...familyFilter, filter: f.filter })}
      />
      <ValueInput
        familyFilter={familyFilter}
        onChange={(f) => onChange({ ...familyFilter, value: f.value })}
      />
    </Box>
  );
}

function SelectField({ familyFilter, onChange }: FamilyFilterSelectProps) {
  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="fieldLabel">Familien-Eigenschaft</InputLabel>
      <Select
        labelId="fieldLabel"
        label={"Familien-Eigenschaft"}
        value={familyFilter?.field || ""}
        onChange={(e) => onChange({ ...familyFilter, field: e.target.value })}
      >
        <MenuItem key={0} value={"familyNumber"}>
          Familiennummer
        </MenuItem>
        <MenuItem key={1} value={"beginOfCare"}>
          Beginn der Betreuung
        </MenuItem>
        <MenuItem key={2} value={"childrenInHousehold"}>
          Anzahl Kinder
        </MenuItem>
        <MenuItem key={3} value={"location"}>
          Wohnort
        </MenuItem>
        <MenuItem key={4} value={"childrenWithDisability"}>
          Kinder mit Behinderung oder von Behinderung bedroht
        </MenuItem>
        <MenuItem key={5} value={"careGiverWithDisability"}>
          Elternteil mit Behinderung
        </MenuItem>
        <MenuItem key={6} value={"childWithPsychDiagnosis"}>
          Kind mit psychologischer Diagnose
        </MenuItem>
        <MenuItem key={7} value={"caregiverWithPsychDiagnosis"}>
          Elternteil mit psychologischer Diagnose
        </MenuItem>
        <MenuItem key={8} value={"migrationBackground"}>
          Migrationshintergrund
        </MenuItem>
        <MenuItem key={9} value={"highestEducation"}>
          Höchster Bildungsabschluss
        </MenuItem>
        <MenuItem key={10} value={"otherInstalledProfessionals"}>
          Andere installierte Fachkräfte
        </MenuItem>
        <MenuItem key={11} value={"comingFrom"}>
          Zugang über
        </MenuItem>
        <MenuItem key={12} value={"endOfCare"}>
          Ende der Betreuung
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export type FamilyFields =
  | "familyNumber"
  | "beginOfCare"
  | "childrenInHousehold"
  | "location"
  | "childrenWithDisability"
  | "careGiverWithDisability"
  | "childWithPsychDiagnosis"
  | "caregiverWithPsychDiagnosis"
  | "migrationBackground"
  | "highestEducation"
  | "otherInstalledProfessionals"
  | "comingFrom"
  | "endOfCare";

function SelectFilter({ familyFilter, onChange }: FamilyFilterSelectProps) {
  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="filterLabel">Filter</InputLabel>
      <Select
        labelId="filterLabel"
        label={"Filter"}
        value={familyFilter?.filter || ""}
        onChange={(e) =>
          onChange({ ...familyFilter, filter: e.target.value as FilterType })
        }
      >
        {availableFilters(familyFilter?.field as FamilyFields).map((f) => (
          <MenuItem value={f.filter}>{f.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function availableFilters(field: FamilyFields): IFilter[] {
  switch (field) {
    case "familyNumber":
      return NumberFilters;
    case "beginOfCare":
      return DateFilters;
    case "childrenInHousehold":
      return NumberFilters;
    case "location":
      return TextFilters;
    case "childrenWithDisability":
      return BoolFilters;
    case "careGiverWithDisability":
      return BoolFilters;
    case "childWithPsychDiagnosis":
      return BoolFilters;
    case "caregiverWithPsychDiagnosis":
      return BoolFilters;
    case "migrationBackground":
      return BoolFilters;
    case "highestEducation":
      return TextFilters;
    case "otherInstalledProfessionals":
      return TextFilters;
    case "comingFrom":
      return TextFilters;
    case "endOfCare":
      return DateFilters;
    default:
      return [];
  }
}

function ValueInput({ familyFilter, onChange }: FamilyFilterSelectProps) {
  switch (familyFilter?.field as FamilyFields) {
    case "familyNumber":
    case "childrenInHousehold":
      return (
        <TextField
          type={"text"}
          value={familyFilter.value}
          onChange={(e) => {
            const number = Number(e.target.value);
            if (Number.isNaN(number)) return;
            onChange({ ...familyFilter, value: number });
          }}
        />
      );
    case "beginOfCare":
    case "endOfCare":
      return (
        <DatePicker
          value={familyFilter.value}
          onChange={(d) => {
            onChange({ ...familyFilter, value: d });
          }}
        />
      );
    case "location":
    case "comingFrom":
    case "otherInstalledProfessionals":
    case "highestEducation":
      return (
        <TextField
          value={familyFilter.value}
          onChange={(e) =>
            onChange({ ...familyFilter, value: e.target.value || undefined })
          }
        />
      );
    case "childrenWithDisability":
    case "careGiverWithDisability":
    case "childWithPsychDiagnosis":
    case "caregiverWithPsychDiagnosis":
    case "migrationBackground":
      return <></>;
    default:
      return <></>;
  }
}

interface FamilyFilterSelectProps {
  familyFilter: IFamilyFilter;
  onChange: (familyFilter: IFamilyFilter) => void;
}
