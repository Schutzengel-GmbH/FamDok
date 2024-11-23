import AddCollectionDataItem from "@/components/masterData/dataFieldAnswerComponents/collection/addCollectionItem";
import CollectionDataItemCard from "@/components/masterData/dataFieldAnswerComponents/collection/collectionItemCard";
import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { CollectionData, FullCollection } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { Box } from "@mui/material";
import { useState } from "react";

export default function CollectionDataFieldAnswerComponent({
  answer,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const collectionDataFieldName = ():
    | "collectionDataString"
    | "collectionDataInt"
    | "collectionDataFloat"
    | "collectionDataDate" => {
    switch (dataField.collectionType) {
      case "Text":
        return "collectionDataString";
      case "Int":
        return "collectionDataInt";
      case "Num":
        return "collectionDataFloat";
      case "Date":
        return "collectionDataDate";
    }
  };

  const [collectionData, setCollectionData] = useState<
    RecursivePartial<FullCollection>
  >(answer?.answerCollection || {});

  const handleCollectionItemAdded = (c: RecursivePartial<CollectionData>) => {
    const newCollectionData = {
      ...collectionData,
      type: dataField.collectionType,
      [collectionDataFieldName()]: collectionData[collectionDataFieldName()]
        ? [...collectionData[collectionDataFieldName()], c]
        : [c],
    };

    setCollectionData(newCollectionData);
    onChange({ ...answer, answerCollection: newCollectionData });
  };

  const handleDelete = (i: number) => {
    setCollectionData({
      ...collectionData,
      [collectionDataFieldName()]: collectionData[
        collectionDataFieldName()
      ].filter((_, index) => index !== i),
    });
  };

  const handleCollectionItemChanged = (
    c: RecursivePartial<CollectionData>
  ) => {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
      {collectionData[collectionDataFieldName()]?.map(
        (v: RecursivePartial<CollectionData>, i: number) => (
          <CollectionDataItemCard
            collectionId={collectionData.id}
            collectionType={dataField.collectionType}
            collectionData={v}
            onChange={handleCollectionItemChanged}
            onDelete={() => handleDelete(i)}
          />
        )
      )}
      <AddCollectionDataItem
        collectionId={collectionData.id}
        collectionType={dataField.collectionType}
        onChange={handleCollectionItemAdded}
      />
    </Box>
  );
}
