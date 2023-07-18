import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { Education } from '@prisma/client';

interface EducationPickComponentProps {
  value: Education | undefined;
  onChange: (education: Education) => void;
  sx?: SxProps;
}

export default function EducationPickComponent({
  value: education,
  onChange,
  sx,
}: EducationPickComponentProps) {
  function handleChange(e: SelectChangeEvent<Education>) {
    onChange(e.target.value as Education);
  }
  return (
    <FormControl sx={sx}>
      <InputLabel id='education-label'>Höchster Bildungsabschluss</InputLabel>
      <Select
        labelId='education-label'
        label={'Höchster Bildungsabschluss'}
        value={education}
        onChange={handleChange}
        defaultValue={Education.Unknown}
      >
        <MenuItem value={Education.Hauptschulabschluss}>
          {Education.Hauptschulabschluss}
        </MenuItem>
        <MenuItem value={Education.Realschulabschluss}>
          {Education.Realschulabschluss}
        </MenuItem>
        <MenuItem value={Education.Fachhochschulreife}>
          {Education.Fachhochschulreife}
        </MenuItem>
        <MenuItem value={Education.Abitur}>{Education.Abitur}</MenuItem>
        <MenuItem value={Education.Berufsausbildung}>{Education.Berufsausbildung}</MenuItem>
        <MenuItem value={Education.UniversityDegree}>{'Universitätsabschluss'}</MenuItem>
        <MenuItem value={Education.None}>Keine</MenuItem>
        <MenuItem value={Education.Other}>Anderes</MenuItem>
        <MenuItem value={Education.Unknown}>Unbekannt / Keine Angabe</MenuItem>
      </Select>
    </FormControl>
  );
}
