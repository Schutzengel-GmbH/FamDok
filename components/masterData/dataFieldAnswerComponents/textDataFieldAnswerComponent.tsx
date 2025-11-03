import { FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { TextField } from "@mui/material";
import { Prisma } from "@prisma/client";

export interface DataFieldAnswerComponentProps {
  answer: RecursivePartial<FullDataFieldAnswer>;
  canEdit: boolean;
  dataField: Prisma.DataFieldGetPayload<{ include: { selectOptions: true } }>;
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
