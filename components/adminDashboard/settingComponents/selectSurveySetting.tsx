import { useSurveys } from "@/utils/apiHooks";
import { MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { ChangeEvent } from "react";

type SelectSurveySettingComponentProps = {
  title: string;
  name: string;
  id: string;
  onChange: (key: string, value: string) => void;
};

export default function SelectSurveySettingComponent({
  title,
  name,
  id,
  onChange,
}: SelectSurveySettingComponentProps) {
  const { surveys } = useSurveys();

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
      <Select value={id} onChange={handleChange}>
        <MenuItem value={"none"}>
          <i>Keine</i>
        </MenuItem>
        {surveys?.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
}
