import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DateDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  return (
    <FormControl sx={{ marginTop: "1rem" }}>
      <DatePicker
        onChange={(date) => {
          if (date)
            onChange({
              ...answer,
              answerDate: date,
              dataFieldId: dataField.id,
            });
        }}
        //@ts-ignore
        value={answer?.answerDate ? new Date(answer.answerDate) : undefined}
      />
    </FormControl>
  );
}

