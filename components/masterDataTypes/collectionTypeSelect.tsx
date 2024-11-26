import { getCollectionTypeName } from "@/utils/masterDataUtils";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { CollectionType } from "@prisma/client";

interface CollectionTypeSelectProps {
  collectionType?: CollectionType;
  onChange: (type: CollectionType) => void;
}

export default function CollectionTypeSelect({
  collectionType,
  onChange,
}: CollectionTypeSelectProps) {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value as CollectionType);
  };

  return (
    <FormControl>
      <InputLabel>Datentyp Sammlung</InputLabel>
      <Select
        label={"Datentyp Sammlung"}
        value={collectionType || "NONE"}
        onChange={handleChange}
      >
        {getTypes().map((t) => (
          <MenuItem value={t} key={t}>
            {getCollectionTypeName(t)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function getTypes() {
  let types: CollectionType[] = [];
  for (const type in CollectionType) {
    if (Object.prototype.hasOwnProperty.call(CollectionType, type)) {
      const element = CollectionType[type];
      types.push(element);
    }
  }
  return types;
}

