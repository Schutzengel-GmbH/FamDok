//@ts-nocheck

import AddCollectionDataItem from "@/components/masterData/dataFieldAnswerComponents/collection/addCollectionItem";
import CollectionDataItemCard from "@/components/masterData/dataFieldAnswerComponents/collection/collectionItemCard";
import { DataFieldAnswerComponentProps } from "@/components/masterData/dataFieldAnswerComponents/textDataFieldAnswerComponent";
import { CollectionData, FullCollection } from "@/types/prismaHelperTypes";
import { AnswerTypeUnion, RecursivePartial } from "@/types/utilTypes";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export interface DataFieldCollectionAnswerComponentProps {
  answer: RecursivePartial<AnswerTypeUnion>;
  dataField: FullDataField;
  onChange: (answer: RecursivePartial<FullDataFieldAnswer>) => void;
}

export default function DataFieldCollectionAnswerComponentProps({
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

  const handleCollectionItemAdded = (c: RecursivePartial<CollectionData>) => {
    const newCollectionData = {
      ...answer?.answerCollection,
      type: dataField.collectionType,
      [collectionDataFieldName()]: answer?.answerCollection[
        collectionDataFieldName()
      ]
        ? [...answer.answerCollection[collectionDataFieldName()], c]
        : [c],
    };

    onChange({ ...answer, answerCollection: newCollectionData });
  };

  const handleDelete = (i: number) => {
    const newCollectionData = {
      ...answer.answerCollection,
      [collectionDataFieldName()]: answer.answerCollection[
        collectionDataFieldName()
      ].filter((_, index) => index !== i),
    };

    onChange({ ...answer, answerCollection: newCollectionData });
  };

  const handleCollectionItemChanged = (
    c: RecursivePartial<CollectionData>
  ) => {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
      {answer?.answerCollection[collectionDataFieldName()]?.map(
        (v: RecursivePartial<CollectionData>, i: number) => (
          <CollectionDataItemCard
            collectionId={answer.answerCollection.id}
            collectionType={dataField.collectionType}
            collectionData={v}
            onChange={handleCollectionItemChanged}
            onDelete={() => handleDelete(i)}
          />
        )
      )}
      <AddCollectionDataItem
        collectionId={answer?.answerCollection.id}
        collectionType={dataField.collectionType}
        onChange={handleCollectionItemAdded}
      />
    </Box>
  );
}

