import NumDataFieldAnswerComponent from "@/components/masterData/dataFieldAnswerComponents/numDataFieldAnswerComponent";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import FloatInput from "@/components/utilityComponents/floatInput";
import { CollectionData } from "@/types/prismaHelperTypes";
import { Add } from "@mui/icons-material";
import { Button, Paper, TextField } from "@mui/material";
import { CollectionType } from "@prisma/client";
import { useState } from "react";

interface AddCollectionDataItemProps {
  collectionId: string;
  collectionType: CollectionType;
  onChange: (data: Partial<CollectionData>) => void;
}

export default function AddCollectionDataItem({
  collectionId,
  collectionType,
  onChange,
}: AddCollectionDataItemProps) {
  const [collectionData, setCollectionData] = useState<Partial<CollectionData>>(
    { collectionId }
  );
  const handleAdd = () => {
    onChange(collectionData);
  };

  const addDisabled = collectionData.value === undefined;

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: ".25rem",
        maxWidth: "500px",
      }}
      elevation={3}
    >
      {collectionType === "Date" && (
        <DatePickerComponent
          currentAnswer={(collectionData.value as Date) || undefined}
          onChange={(d) => setCollectionData({ ...collectionData, value: d })}
        />
      )}
      {collectionType === "Int" && (
        <TextField
          value={(collectionData.value as string) || undefined}
          onChange={(e) =>
            setCollectionData({
              ...collectionData,
              value: parseInt(e.target.value),
            })
          }
        />
      )}
      {collectionType === "Num" && (
        <FloatInput
          value={(collectionData.value as number) || undefined}
          onChange={(value) =>
            setCollectionData({
              ...collectionData,
              value,
            })
          }
        />
      )}
      {collectionType === "Text" && (
        <TextField
          value={(collectionData.value as number) || undefined}
          onChange={(e) =>
            setCollectionData({ ...collectionData, value: e.target.value })
          }
        />
      )}
      <Button onClick={handleAdd} disabled={addDisabled}>
        <Add /> Hinzufügen
      </Button>
    </Paper>
  );
}

