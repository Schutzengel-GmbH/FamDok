import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { QuestionTypeUnion, RecursivePartial } from "@/types/utilTypes";
import { TextField } from "@mui/material";

export interface DataFieldAnswerComponentProps {
  answer: RecursivePartial<FullDataFieldAnswer>;
  canEdit: boolean;
  dataField: QuestionTypeUnion;
  onChange: (answer: RecursivePartial<FullDataFieldAnswer>) => void;
}

export default function TextDataFieldAnswerComponent({
  answer,
  canEdit,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  return (
    <TextField
      disabled={!canEdit}
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

