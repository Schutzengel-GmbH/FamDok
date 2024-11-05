import { FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { Paper } from "@mui/material";

interface BoolDataFieldInputProps {
  answer?: FullDataFieldAnswer;
  onChange: (answer: FullDataFieldAnswer) => void;
}

export default function BoolDataFieldInput({}: BoolDataFieldInputProps) {
  return <Paper></Paper>;
}
