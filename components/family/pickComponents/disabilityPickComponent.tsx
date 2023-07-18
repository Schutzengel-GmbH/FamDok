import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { Disability, Gender } from '@prisma/client';

interface DisabilityPickComponentProps {
  value: Disability | undefined;
  onChange: (education: Disability) => void;
  sx?: SxProps;
}

export default function DisabilityPickComponent({
  value: disability,
  onChange,
  sx,
}: DisabilityPickComponentProps) {
  function handleChange(e: SelectChangeEvent<Disability>) {
    onChange(e.target.value as Disability);
  }
  return (
    <FormControl sx={sx}>
      <InputLabel id='disability-label'>Behinderung</InputLabel>
      <Select
        labelId='disability-label'
        label={'Behinderung'}
        value={disability}
        onChange={handleChange}
        defaultValue={Disability.Unknown}
      >
        <MenuItem value={Disability.Yes}>Ja</MenuItem>
        <MenuItem value={Disability.No}>Nein</MenuItem>
        <MenuItem value={Disability.Impending}>Von Behinderung bedroht</MenuItem>
        <MenuItem value={Disability.None}>Keine Angabe</MenuItem>
        <MenuItem value={Disability.Unknown}>Unbekannt</MenuItem>
      </Select>
    </FormControl>
  );
}
