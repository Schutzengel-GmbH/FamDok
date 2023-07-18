import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";

export interface SelectOptionsComponentProps {
  value: { value: string; isOpen?: boolean }[];
  onChange: (value: { value: string; isOpen?: boolean }[]) => void;
}

export default function SelectOptionsComponent({
  value,
  onChange,
}: SelectOptionsComponentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography>
        <strong>Antwortoptionen:</strong>
      </Typography>
      {value.map((option, i) => {
        let v = [...value];
        return (
          <TextField
            label={option.isOpen ? "Sonstiges-Option" : "Option"}
            sx={{ mt: ".5rem" }}
            key={i}
            value={v[i].value}
            onChange={(e) => {
              v[i] = { ...v[i], value: e.target.value };
              onChange(v);
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    v.splice(i, 1);
                    onChange(v);
                  }}
                >
                  <Delete />
                </IconButton>
              ),
            }}
          />
        );
      })}
      <Button
        onClick={() => {
          onChange([...value, { value: "", isOpen: false }]);
        }}
      >
        <Add />
      </Button>

      <Button
        onClick={() => {
          onChange([...value, { value: "", isOpen: true }]);
        }}
      >
        <Add /> Sonstiges-Option
      </Button>
    </Box>
  );
}
