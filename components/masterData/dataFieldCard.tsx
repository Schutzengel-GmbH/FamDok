import TextDataFieldInput from "@/components/masterData/masterDataTypes/textDataFieldInput";
import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { Cancel, Save } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataFieldAnswer, DataField } from "@prisma/client";

interface DataFieldCardProps {
  dataField: FullDataField;
  answer: Partial<FullDataFieldAnswer>;
  onChange: (answer: Partial<FullDataFieldAnswer>) => void;
}

export default function DataFieldCard({
  dataField,
  answer,
  onChange,
}: DataFieldCardProps) {
  const getAnswerComponent = () => {
    switch (dataField.type) {
      case "Text":
        return (
          <TextDataFieldInput
            dataField={dataField}
            onChange={(a) => onChange(a)}
          />
        );
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
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {getAnswerComponent()}
      </Box>
      <Box sx={{ ml: "auto" }}>
        <Button>
          <Save />
        </Button>
        <Button>
          <Cancel />
        </Button>
      </Box>
    </Paper>
  );
}
