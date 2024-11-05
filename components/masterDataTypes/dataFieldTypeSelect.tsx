import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DataFieldType } from "@prisma/client";

interface DataFieldTypeSelectProps {
  type?: DataFieldType;
  onChange: (type: DataFieldType) => void;
}

export default function DataFieldTypeSelect({
  type,
  onChange,
}: DataFieldTypeSelectProps) {
  const handleChange = (e: SelectChangeEvent) => {
    console.log(e.target.value);
    onChange(e.target.value as DataFieldType);
  };

  return (
    <FormControl>
      <InputLabel>Datenfeldtyp</InputLabel>
      <Select
        label={"Datenfeldtyp"}
        value={type || "NONE"}
        onChange={handleChange}
      >
        <MenuItem value="NONE"></MenuItem>
        {getTypes().map((t) => (
          <MenuItem value={t}>{getTypeName(t)}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function getTypes() {
  let types: DataFieldType[] = [];
  for (const type in DataFieldType) {
    if (Object.prototype.hasOwnProperty.call(DataFieldType, type)) {
      const element = DataFieldType[type];
      types.push(element);
    }
  }
  return types;
}

function getTypeName(type: DataFieldType): string {
  switch (type) {
    case "Text":
      return "Text";
    case "Bool":
      return "Ja/Nein";
    case "Int":
      return "Ganze Zahl";
    case "Num":
      return "Zahl";
    case "Select":
      return "Auswahl";
    case "Date":
      return "Datum";
    default:
      return type;
  }
}
