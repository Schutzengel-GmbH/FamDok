import { apiPostJson } from "@/utils/fetchApiUtils";
import { Add } from "@mui/icons-material";
import { Button, Paper, TextField } from "@mui/material";
import { useState } from "react";

type NewLocationComponentProps = {
  onChange: () => void;
};

export default function NewComingFromOptionComponent({
  onChange,
}: NewLocationComponentProps) {
  const [value, setValue] = useState("");

  async function handleSave() {
    const res = await apiPostJson("/api/comingFromOptions", { value });
    setValue("");
    onChange();
  }

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: ".5rem",
        maxWidth: "500px",
      }}
      elevation={3}
    >
      <TextField
        sx={{ width: "60%" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={handleSave}>
        <Add /> Hinzufügen
      </Button>
    </Paper>
  );
}

