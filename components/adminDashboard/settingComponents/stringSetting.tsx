import {
  FormLabel,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";

type StringSettingComponentProps = {
  title: string;
  name: string;
  value: string;
  tooltip?: string;
  onChange: (key: string, value: string) => void;
};

export default function StringSettingComponent({
  title,
  name,
  value,
  tooltip,
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
      <Tooltip title={tooltip}>
        <Typography>{title}:</Typography>
      </Tooltip>
      <TextField sx={{ flexGrow: 1 }} value={value} onChange={handleChange} />
    </Paper>
  );
}

