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
        return collectionData.value as string;
      case "Int":
        return collectionData.value as number;
      case "Num":
        return (collectionData.value as number).toLocaleString();
      case "Date":
        return new Date(collectionData.value as string).toLocaleDateString();
      default:
        return "??";
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: ".5rem",
        pl: "1rem",
        maxWidth: "500px",
      }}
      elevation={3}
    >
      <Typography>{displayValue()}</Typography>
      <Button onClick={onDelete}>
        <Delete /> Löschen
      </Button>
    </Paper>
  );
}

