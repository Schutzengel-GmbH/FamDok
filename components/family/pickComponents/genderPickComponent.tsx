import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { Gender } from '@prisma/client';

interface GenderPickComponentProps {
  value: Gender | undefined;
  onChange: (gender: Gender) => void;
  sx?: SxProps;
}

export default function GenderPickComponent({
  value: gender,
  onChange,
  sx,
}: GenderPickComponentProps) {
  function handleChange(e: SelectChangeEvent<Gender>) {
    onChange(e.target.value as Gender);
  }
  return (
    <FormControl sx={sx}>
      <InputLabel id='gender-label'>Geschlecht</InputLabel>
      <Select
        labelId='gender-label'
        label={'Geschlecht'}
        value={gender}
        onChange={handleChange}
        defaultValue={Gender.Unknown}
      >
        <MenuItem value={Gender.Male}>Männlich</MenuItem>
        <MenuItem value={Gender.Female}>Weiblich</MenuItem>
        <MenuItem value={Gender.Other}>Anderes</MenuItem>
        <MenuItem value={Gender.Unknown}>Unbekannt / Keine Angabe</MenuItem>
      </Select>
    </FormControl>
  );
}
