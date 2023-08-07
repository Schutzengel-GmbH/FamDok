import { AnswerComponentProps } from "@/components/response/answerQuestion";
import ScaleItemComponent from "@/components/response/questionTypes/scaleItemComponent";
import { Box, RadioGroup } from "@mui/material";
import { SelectOption } from "@prisma/client";
import { ChangeEvent } from "react";

export default function AnswerScaleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...answer,
      answerSelect: [question.selectOptions[parseInt(e.target.value)]],
    });
  }

  function isChecked(o: Partial<SelectOption>): boolean {
    return answer
      ? answer.answerSelect.findIndex((a) => a.id === o.id) >= 0
      : question.defaultAnswerSelectOptions.findIndex((a) => a.id === o.id) >=
          0 || false;
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
            checked={isChecked(option)}
            label={option.value}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

