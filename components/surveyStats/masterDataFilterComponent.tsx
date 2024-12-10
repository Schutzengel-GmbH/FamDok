import CollectionValues from "@/components/surveyStats/collectionValues";
import SelectOptionAutocomplete from "@/components/surveyStats/selectOptionAutocomplete";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import {
  FullDataField,
  FullMasterDataType,
  FullSurvey,
} from "@/types/prismaHelperTypes";
import {
  getFiltersForDataFieldType,
  IMasterDataFilter,
  NO_VALUE_FILTERS,
} from "@/utils/filters";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataField, SelectOption } from "@prisma/client";

interface MasterDataFilterComponentProps {
  survey: FullSurvey;
  masterDataFilter: IMasterDataFilter;
  onChange: (masterDataFilter: IMasterDataFilter) => void;
}

export default function MasterDataFilterComponent({
  survey,
  masterDataFilter,
  onChange,
}: MasterDataFilterComponentProps) {
  const dataField = survey?.masterDataType.dataFields.find(
    (currentDataField) => currentDataField.id === masterDataFilter?.dataFieldId
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: ".5rem",
        width: "100%",
      }}
    >
      <SelectDataField
        masterDataType={survey.masterDataType}
        dataField={dataField}
        onChange={(dataField) => onChange({ dataFieldId: dataField.id })}
      />
      <SelectFilter
        dataField={dataField}
        filter={masterDataFilter}
        onChange={(f) =>
          onChange({
            ...masterDataFilter,
            filter: f.filter,
            value: f.value ?? masterDataFilter.value,
          })
        }
      />
      <ValueInput
        dataField={dataField}
        filter={masterDataFilter}
        onChange={(f) => onChange({ ...masterDataFilter, value: f.value })}
      />
    </Box>
  );
}

interface SelectDataFieldProps {
  masterDataType: FullMasterDataType;
  dataField: DataField;
  onChange: (dataField: DataField) => void;
}

function SelectDataField({
  masterDataType,
  dataField,
  onChange,
}: SelectDataFieldProps) {
  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Datenfeld</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Datenfeld"}
        value={dataField?.id || ""}
        onChange={(e) =>
          onChange(
            masterDataType.dataFields.find((q) => q.id === e.target.value)
          )
        }
      >
        {masterDataType.dataFields.map((df) => (
          <MenuItem key={df.id} value={df.id}>
            {df.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface SelectFilterProps {
  dataField: DataField;
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function SelectFilter({ dataField, filter, onChange }: SelectFilterProps) {
  const filters = getFiltersForDataFieldType(dataField);

  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Filter</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Filter"}
        value={filter?.filter || ""}
        onChange={(e) => {
          let filterToUse = filters.find((f) => f.filter === e.target.value);
          onChange(filterToUse);
        }}
      >
        {filters.map((f) => (
          <MenuItem key={f.filter} value={f.filter}>
            {dataField.type === "Collection"
              ? f.filter === "collectionHasValue" ||
                f.filter === "emptyOrNoCollection"
                ? f.name
                : `Ein Element der Sammlung ist ${f.name}`
              : f.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface ValueInputProps {
  dataField: FullDataField;
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function ValueInput({ dataField, filter, onChange }: ValueInputProps) {
  if (NO_VALUE_FILTERS.includes(filter?.filter)) return <></>;

  switch (dataField?.type) {
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
          question={dataField}
          options={filter.value}
          onChange={(o) => onChange({ ...filter, value: o })}
        />
      );
    case "Collection":
      return (
        <CollectionValues
          dataField={dataField}
          value={filter.value}
          onChange={(o) => onChange({ ...filter, value: o })}
        />
      );

    default:
      return <></>;
  }
}

