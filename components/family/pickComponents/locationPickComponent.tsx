import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { PossibleLocation } from "@prisma/client";

type LocationPickerProps = {
  locations: PossibleLocation[];
  sx?: SxProps;
  value: string;
  onChange: (locationName: string) => void;
};

export default function LocationPicker({
  locations,
  sx,
  value,
  onChange,
}: LocationPickerProps) {
  return (
    <Box sx={sx}>
      <Select
        defaultValue={value || null}
        displayEmpty
        onChange={(e: SelectChangeEvent<string | null>) =>
          onChange(e.target.value)
        }
      >
        {locations.map((l) => (
          <MenuItem key={l.id} value={l.name}>
            {l.name}
          </MenuItem>
        ))}
        <MenuItem value={null}>Keine Angabe/Unbekannt</MenuItem>
      </Select>
    </Box>
  );
}

