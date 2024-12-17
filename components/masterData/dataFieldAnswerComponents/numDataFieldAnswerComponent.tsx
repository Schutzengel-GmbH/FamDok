import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import FloatInput from "@/components/utilityComponents/floatInput";

export default function NumDataFieldAnswerComponent({
  answer,
  dataField,
  canEdit,
  onChange,
}: DataFieldAnswerComponentProps) {
  function handleChange(value: number) {
    onChange({ ...answer, answerNum: value });
  }

  return (
    <FloatInput
      disabled={!canEdit}
      value={answer?.answerNum}
      onChange={handleChange}
    />
  );
}

