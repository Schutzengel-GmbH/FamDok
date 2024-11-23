import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { TextField } from "@mui/material";

export interface DataFieldAnswerComponentProps {
  answer: RecursivePartial<FullDataFieldAnswer>;
  dataField: FullDataField;
  onChange: (answer: RecursivePartial<FullDataFieldAnswer>) => void;
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
