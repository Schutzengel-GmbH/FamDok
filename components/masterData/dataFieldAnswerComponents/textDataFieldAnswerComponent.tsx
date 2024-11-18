import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { TextField } from "@mui/material";

export interface DataFieldAnswerComponentProps {
  answer: Partial<FullDataFieldAnswer>;
  dataField: FullDataField;
  onChange: (answer: Partial<FullDataFieldAnswer>) => void;
}

export default function TextDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  return (
    <TextField
      value={answer?.answerText || ""}
      onChange={(e) =>
        onChange({
          ...answer,
          answerText: e.target.value,
          dataFieldId: dataField.id,
        })
      }
    />
  );
}
