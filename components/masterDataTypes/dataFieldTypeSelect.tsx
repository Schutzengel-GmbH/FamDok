import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
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
    <Select value={type} onChange={handleChange}>
      {getTypes().map((t) => (
        <MenuItem value={t}>{t}</MenuItem>
      ))}
    </Select>
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

