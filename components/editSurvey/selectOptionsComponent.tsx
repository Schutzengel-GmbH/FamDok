import EditSelectOptionInfo from "@/components/editSurvey/editSelectOptionInfo";
import { Add, Delete, Info } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

export interface SelectOptionsComponentProps {
  value: { value: string; isOpen?: boolean; info?: string }[];
  onChange: (
    value: { value: string; isOpen?: boolean; info?: string }[]
  ) => void;
}

export default function SelectOptionsComponent({
  value,
  onChange,
}: SelectOptionsComponentProps) {
  const [infoOpen, setInfoOpen] = useState<boolean[]>(value.map((_) => false));

  function toggleInfoOpen(i: number) {
    let _infoOpen = [...infoOpen];
    _infoOpen[i] = !_infoOpen[i];
    setInfoOpen(_infoOpen);
  }

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
                <>
                  <IconButton
                    onClick={() => {
                      v.splice(i, 1);
                      onChange(v);
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => toggleInfoOpen(i)}
                  >
                    <Info color={v[i].info ? "primary" : "disabled"} />
                  </IconButton>

                  <EditSelectOptionInfo
                    initialInfo={v[i].info}
                    open={infoOpen[i]}
                    onClose={() => toggleInfoOpen(i)}
                    onSave={(info) => {
                      v[i] = { ...v[i], info };
                      onChange(v);
                    }}
                  />
                </>
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
