import BoolDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/boolDataFieldAnswerComponent";
import CollectionDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/collectionDataFieldAnswerComponent";
import DateDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/dateDataFieldAnswerComponent";
import IntDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/intDataFieldAnswerComponent";
import NumDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/numDataFieldAnswerComponent";
import SelectDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/selectDataFieldAnswerComponent";
import TextDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { Alert, Box, Paper, Typography } from "@mui/material";

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
          <TextDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Bool":
        return (
          <BoolDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Int":
        return (
          <IntDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Num":
        return (
          <NumDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Select":
        return (
          <SelectDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Date":
        return (
          <DateDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      case "Collection":
        return (
          <CollectionDataFieldAnswerComponent
            dataField={dataField}
            answer={answer}
            onChange={(a) => onChange(a)}
          />
        );
      default:
        return (
          <Alert severity="error">{`Fehler bei Datenfeld: ${dataField.text} - Unbekannter Datentyp`}</Alert>
        );
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        alignItems: "baseline",
        p: ".5rem",
      }}
    >
      <Typography variant="h6">{dataField.text}:</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {getAnswerComponent()}
      </Box>
    </Paper>
  );
}
