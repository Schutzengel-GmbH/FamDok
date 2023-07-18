import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';

interface BooleanOrUndefinedPickComponentProps {
  value: boolean | undefined;
  title: string;
  onChange: (value: boolean | undefined) => void;
  sx?: SxProps;
}

export default function BooleanOrUndefinedPickComponent({
  value,
  onChange,
  sx,
  title,
}: BooleanOrUndefinedPickComponentProps) {
  function getBoolOrUndefinedFromString(m: string) {
    switch (m) {
      case 'yes':
        return true;
      case 'no':
        return false;
      default:
        return undefined;
    }
  }

  function getStringFromBoolOrUndefined(m: boolean | undefined) {
    switch (m) {
      case true:
        return 'yes';
      case false:
        return 'no';
      default:
        return 'unknown';
    }
  }

  function handleChange(e: SelectChangeEvent<string>) {
    onChange(getBoolOrUndefinedFromString(e.target.value));
  }

  return (
    <FormControl sx={sx}>
      <InputLabel id={`${title}-label`}>{title}</InputLabel>
      <Select
        labelId={`${title}-label`}
        label={title}
        value={getStringFromBoolOrUndefined(value)}
        onChange={handleChange}
        defaultValue={undefined}
      >
        <MenuItem value={'yes'}>Ja</MenuItem>
        <MenuItem value={'no'}>Nein</MenuItem>
        <MenuItem value={'unknown'}>Unbekannt / Keine Angabe</MenuItem>
      </Select>
    </FormControl>
  );
}
