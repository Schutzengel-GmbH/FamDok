import { Search, Clear } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton, SxProps } from "@mui/material";

type SearchTextFieldProps = {
  label?: string;
  filter: string;
  sx?: SxProps;
  onChange: (filter: string) => void;
};

export default function SearchTextField({
  label,
  filter,
  sx,
  onChange,
}: SearchTextFieldProps) {
  return (
    <TextField
      sx={sx}
      label={label || "Suche"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {filter && (
              <IconButton onClick={() => onChange("")}>
                <Clear />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
      value={filter}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}

