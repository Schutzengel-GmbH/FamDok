import { AnswerComponentProps } from "@/components/response/answerQuestion";
import ScaleItemComponent from "@/components/response/questionTypes/scaleItemComponent";
import { Box, RadioGroup } from "@mui/material";
import { ChangeEvent } from "react";

export default function AnswerScaleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...answer, answerInt: parseInt(e.target.value) });
  }

  function isChecked(i: number): boolean {
    return Number.isInteger(answer?.answerInt) && answer.answerInt === i;
  }

  return (
    <Box sx={{ m: "1rem" }}>
      <RadioGroup
        sx={{ display: "flex", flexDirection: "row" }}
        onChange={handleChange}
      >
        {question.selectOptions.map((option, i) => (
          <ScaleItemComponent
            key={i}
            index={i}
            checked={isChecked(i)}
            label={option.value}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

