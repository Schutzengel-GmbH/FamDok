import BoolDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/boolDataFieldAnswerComponent";
import CollectionDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/collectionDataFieldAnswerComponent";
import DateDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/dateDataFieldAnswerComponent";
import IntDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/intDataFieldAnswerComponent";
import NumDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/numDataFieldAnswerComponent";
import SelectDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/selectDataFieldAnswerComponent";
import TextDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { dataFieldAnswerHasNoValues } from "@/utils/utils";
import { Alert, Box, Paper, Typography } from "@mui/material";

interface DataFieldCardProps {
  dataField: FullDataField;
  canEdit: boolean;
  answer: Partial<FullDataFieldAnswer>;
  onChange: (answer: Partial<FullDataFieldAnswer>) => void;
}

export default function DataFieldCard({
  dataField,
  canEdit,
  answer,
  onChange,
}: DataFieldCardProps) {
  const handleChange = (a: Partial<FullDataFieldAnswer>) => {
    onChange(a);
  };

  const requiredButNoAnswer =
    dataField.required && dataFieldAnswerHasNoValues(answer);

  const getAnswerComponent = () => {
    switch (dataField.type) {
      case "Text":
        return (
          <TextDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Bool":
        return (
          <BoolDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Int":
        return (
          <IntDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Num":
        return (
          <NumDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Select":
        return (
          <SelectDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Date":
        return (
          <DateDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
          />
        );
      case "Collection":
        return (
          <CollectionDataFieldAnswerComponent
            canEdit={canEdit}
            dataField={dataField}
            answer={answer}
            //@ts-ignore
            onChange={handleChange}
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
        border: requiredButNoAnswer ? "2px solid red" : "none",
      }}
    >
      <Typography variant="h6">{dataField.text}:</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {getAnswerComponent()}
      </Box>
      {requiredButNoAnswer && (
        <Typography color={"error"}>*Diese Frage ist nicht optional</Typography>
      )}
    </Paper>
  );
}

