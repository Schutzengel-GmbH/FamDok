import { FullDataField } from "@/types/prismaHelperTypes";
import { Paper, TextField, Typography } from "@mui/material";
import { DataField, DataFieldAnswer } from "@prisma/client";
import { ChangeEvent } from "react";

interface TextDataFieldInputProps {
  dataField: FullDataField;
  answer?: Partial<DataFieldAnswer>;
  onChange: (answer: Partial<DataFieldAnswer>, dataField: DataField) => void;
}

export default function TextDataFieldInput({
  dataField,
  answer,
  onChange,
}: TextDataFieldInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(
      { ...answer, answerText: e.target.value, dataFieldId: dataField.id },
      dataField
    );

  return (
    <Paper
      sx={{
        p: ".5rem",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">{dataField.text}</Typography>
      <TextField value={answer?.answerText || ""} onChange={handleChange} />
    </Paper>
  );
}
