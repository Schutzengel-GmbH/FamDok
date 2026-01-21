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
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  DataField,
  Organization,
  SelectOption,
  SubOrganization,
} from "@prisma/client";
import UserSelectId from "./userSelectId";
import SelectOrgOrSubOrg from "./selectOrgOrSubOrg";
import { da } from "date-fns/locale";

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
  let dataField;
  if (
    masterDataFilter?.dataFieldId === "NUMBER" ||
    masterDataFilter?.dataFieldId === "CREATEDBY" ||
    masterDataFilter?.dataFieldId === "CREATEDBYORG"
  )
    dataField = masterDataFilter.dataFieldId;
  else
    dataField = masterDataType?.dataFields.find(
      (currentDataField) =>
        currentDataField.id === masterDataFilter?.dataFieldId,
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
        masterDataType={masterDataType}
        dataField={dataField}
        onChange={(dataField) =>
          onChange({
            dataFieldId:
              typeof dataField === "object" ? dataField.id : dataField,
          })
        }
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
  dataField: DataField | "NUMBER" | "CREATEDBY" | "CREATEDBYORG";
  onChange: (dataField: Partial<DataField>) => void;
}

function SelectDataField({
  masterDataType,
  dataField,
  onChange,
}: SelectDataFieldProps) {
  function change(e: SelectChangeEvent<string>) {
    switch (e.target.value) {
      case "NUMBER":
      case "CREATEDBY":
      case "CREATEDBYORG":
        onChange({ id: e.target.value });
        break;
      default:
        const df = masterDataType.dataFields.find(
          (d) => d.id === e.target.value,
        );
        onChange(df);
        break;
    }
  }

  return (
    <FormControl sx={{ width: "25%" }}>
      <InputLabel id="questionLabel">Datenfeld</InputLabel>
      <Select
        labelId="questionLabel"
        label={"Datenfeld"}
        value={typeof dataField === "object" ? dataField.id : dataField || ""}
        onChange={change}
      >
        <MenuItem key={"NUMBER"} value={"NUMBER"}>
          Nummer (Stammdatenart {masterDataType.name})
        </MenuItem>
        <MenuItem key={"CREATEDBY"} value={"CREATEDBY"}>
          Erstellt von ...
        </MenuItem>
        <MenuItem key={"CREATEDBYORG"} value={"CREATEDBYORG"}>
          Erstellt von Organisation ...
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
  dataField: DataField | "NUMBER" | "CREATEDBY" | "CREATEDBYORG";
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function SelectFilter({ dataField, filter, onChange }: SelectFilterProps) {
  const filters =
    dataField === "NUMBER"
      ? getFiltersForDataFieldType({ type: "Int", omit: ["empty", "notEmpty"] })
      : getFiltersForDataFieldType(dataField);

  if (dataField === "CREATEDBY" || dataField === "CREATEDBYORG") return <></>;

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
  dataField: FullDataField | "NUMBER" | "CREATEDBY" | "CREATEDBYORG";
  filter: IMasterDataFilter;
  onChange: (filter: IMasterDataFilter) => void;
}

function ValueInput({ dataField, filter, onChange }: ValueInputProps) {
  if (NO_VALUE_FILTERS.includes(filter?.filter)) return <></>;

  const type =
    dataField === "NUMBER"
      ? "Num"
      : dataField === "CREATEDBY"
        ? "CREATEDBY"
        : dataField === "CREATEDBYORG"
          ? "CREATEDBYORG"
          : dataField?.type;

  switch (type) {
    case "CREATEDBYORG":
      return (
        <SelectOrgOrSubOrg
          organization={filter?.value?.organization}
          subOrganization={filter?.value?.subOrganization}
          onChange={(org, subOrg) =>
            onChange({
              ...filter,
              value: { organization: org, subOrganization: subOrg },
            })
          }
        />
      );
    case "CREATEDBY":
      return (
        <UserSelectId
          userId={filter.value}
          onChange={(id) => onChange({ ...filter, value: id })}
        />
      );
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
          question={dataField as FullDataField}
          options={filter.value}
          onChange={(o) => onChange({ ...filter, value: o })}
        />
      );
    case "Collection":
      return (
        <CollectionValues
          dataField={dataField as FullDataField}
          value={filter.value}
          onChange={(o) => onChange({ ...filter, value: o })}
        />
      );

    default:
      return <></>;
  }
}
