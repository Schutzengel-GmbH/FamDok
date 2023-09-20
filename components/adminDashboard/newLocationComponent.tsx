import { apiPostJson } from "@/utils/fetchApiUtils";
import { Add } from "@mui/icons-material";
import { Button, Paper, TextField } from "@mui/material";
import { useState } from "react";

type NewLocationComponentProps = {
  onChange: () => void;
};

export default function NewLocationComponent({
  onChange,
}: NewLocationComponentProps) {
  const [name, setName] = useState("");

  async function handleSave() {
    const res = await apiPostJson("/api/locations", { name });
    setName("");
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
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSave}>
        <Add /> Hinzufügen
      </Button>
    </Paper>
  );
}

