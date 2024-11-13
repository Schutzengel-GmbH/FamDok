import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

interface TextDataFieldInputProps {
  dataField: FullDataField;
  answer?: Partial<FullDataFieldAnswer>;
  onChange: (answer: Partial<FullDataFieldAnswer>) => void;
}

export default function TextDataFieldInput({
  dataField,
  answer,
  onChange,
}: TextDataFieldInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({
      ...answer,
      answerText: e.target.value,
      dataFieldId: dataField.id,
    });

  return <TextField value={answer?.answerText || ""} onChange={handleChange} />;
}
