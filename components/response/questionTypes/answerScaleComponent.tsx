import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { Typography, Box, Slider } from "@mui/material";

export default function AnswerScaleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const marks = [
    ...question.selectOptions.map((option, i) => ({
      value: i,
      label: <Typography>{option.value}</Typography>,
    })),
  ];

  return (
    <Box sx={{ m: "1rem" }}>
      <Slider
        sx={{
          '& .MuiSlider-markLabel[data-index="0"]': {
            transform: "translateX(0%)",
          },
          [`& .MuiSlider-markLabel[data-index="${
            question.selectOptions.length - 1
          }"]`]: {
            transform: "translateX(-100%)",
          },
        }}
        value={answer?.answerInt ?? question.defaultAnswerInt ?? 0}
        onChange={(_, value) =>
          onChange({ ...answer, answerInt: value as number })
        }
        valueLabelDisplay="off"
        step={1}
        track={false}
        marks={marks}
        min={0}
        max={question.selectOptions.length - 1}
      />
    </Box>
  );
}
