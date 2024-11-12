import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { Paper, Typography } from "@mui/material";

interface DataFieldCardProps {
  dataField: FullDataField;
  answer: FullDataFieldAnswer;
}

export default function DataFieldCard({
  dataField,
  answer,
}: DataFieldCardProps) {
  const getAnswerString = () => {
    switch (dataField.type) {
      case "Text":
        return answer?.answerText;
      case "Bool":
      case "Int":
      case "Num":
      case "Select":
      case "Date":
      default:
        return "??";
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: ".5rem",
        alignItems: "baseline",
        p: ".5rem",
      }}
    >
      <Typography variant="h6">{dataField.text}:</Typography>
      <Typography>{getAnswerString()}</Typography>
    </Paper>
  );
}

