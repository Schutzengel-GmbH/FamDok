import { FormLabel, Paper, TextField, Typography } from "@mui/material";
import { ChangeEvent } from "react";

type StringSettingComponentProps = {
  title: string;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
};

export default function StringSettingComponent({
  title,
  name,
  value,
  onChange,
}: StringSettingComponentProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(name, e.target.value);
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexDirection: "row",
        p: ".5rem",
      }}
    >
      <Typography>{title}:</Typography>
      <TextField sx={{ flexGrow: 1 }} value={value} onChange={handleChange} />
    </Paper>
  );
}
