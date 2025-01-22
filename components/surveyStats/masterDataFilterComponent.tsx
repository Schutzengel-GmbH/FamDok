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
  masterDataType: FullMasterDataType;
  masterDataFilter: IMasterDataFilter;
  onChange: (masterDataFilter: IMasterDataFilter) => void;
}

export default function MasterDataFilterComponent({
  masterDataType,
  masterDataFilter,
  onChange,
}: MasterDataFilterComponentProps) {
  const dataField = masterDataType?.dataFields.find(
    (currentDataField) => currentDataField.id === masterDataFilter?.dataFieldId
  );

  const isNumberFilter: boolean = masterDataFilter?.dataFieldId === "NUMBER";
  console.log(isNumberFilter);

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
        isNumberFilter={isNumberFilter}
        masterDataType={masterDataType}
        dataField={dataField}
        onChange={(dataField) =>
          onChange({
            dataFieldId: dataField === "NUMBER" ? "NUMBER" : dataField.id,
          })
        }
      />
      <SelectFilter
        isNumberFilter={isNumberFilter}
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
        isNumberFilter={isNumberFilter}
        dataField={dataField}
        filter={masterDataFilter}
        onChange={(f) => onChange({ ...masterDataFilter, value: f.value })}
      />
    </Box>
  );
}

interface SelectDataFieldProps {
  isNumberFilter: boolean;
  masterDataType: FullMasterDataType;
  dataField: DataField;
  onChange: (dataField: DataField | "NUMBER") => void;
}

function SelectDataField({
  isNumberFilter,
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
        value={isNumberFilter ? "NUMBER" : dataField?.id || ""}
        onChange={(e) =>
          e.target.value === "NUMBER"
            ? onChange("NUMBER")
            : onChange(
                masterDataType.dataFields.find((q) => q.id === e.target.value)
              )
        }
      >
        <MenuItem key={"NUMBER"} value={"NUMBER"}>
          Nummer (Stammdatenart {masterDataType.name})
        </MenuItem>
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
  isNumberFilter: boolean;
  dataField: DataField;
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function SelectFilter({
  isNumberFilter,
  dataField,
  filter,
  onChange,
}: SelectFilterProps) {
  const filters = isNumberFilter
    ? getFiltersForDataFieldType({ type: "Int", omit: ["empty", "notEmpty"] })
    : getFiltersForDataFieldType(dataField);

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
            {f.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface ValueInputProps {
  isNumberFilter: boolean;
  dataField: FullDataField;
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function ValueInput({
  isNumberFilter,
  dataField,
  filter,
  onChange,
}: ValueInputProps) {
  if (NO_VALUE_FILTERS.includes(filter?.filter)) return <></>;

  if (isNumberFilter)
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

