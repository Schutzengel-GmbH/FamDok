import { CollectionData } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { Delete } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { CollectionType } from "@prisma/client";
import { useState } from "react";

interface CollectionDataItemCardProps {
  collectionId: string;
  collectionType: CollectionType;
  collectionData: RecursivePartial<CollectionData>;
  onChange: (data: RecursivePartial<CollectionData>) => void;
  onDelete: () => void;
}

export default function CollectionDataItemCard({
  collectionData,
  collectionType,
  onChange,
  onDelete,
}: CollectionDataItemCardProps) {
  const [currCollectionData, setCurrCollectionData] =
    useState<RecursivePartial<CollectionData>>(collectionData);

  const displayValue = () => {
    switch (collectionType) {
      case "Text":
      case "Int":
      case "Num":
      case "Date":
      default:
        return <Typography>???</Typography>;
    }
  };

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
      //TODO: there is some fuckery
      {(collectionData as CollectionData).value.toString()}
      <Button onClick={onDelete}>
        <Delete /> Löschen
      </Button>
    </Paper>
  );
}

