import SelectOptionsComponent from "@/components/editSurvey/selectOptionsComponent";
import DataFieldTypeSelect from "@/components/masterDataTypes/dataFieldTypeSelect";
import { FullDataField, FullMasterDataType } from "@/types/prismaHelperTypes";
import {
  addDataField,
  deleteDataField,
  updateDataField,
} from "@/utils/masterDataUtils";
import { Box, Button, Paper, TextField } from "@mui/material";
import { DataFieldType, Prisma } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

interface EditDataFieldProps {
  masterDataType: FullMasterDataType;
  dataField?: FullDataField;
  onSave: () => void;
}

export default function EditDataField({
  masterDataType,
  dataField,
  onSave,
}: EditDataFieldProps) {
  useEffect(() => {
    setCurrentDataField(dataField);
  }, [dataField]);

  const [currentDataField, setCurrentDataField] =
    useState<Partial<FullDataField>>(dataField);

  const handleCancel = () => {
    setCurrentDataField(dataField);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteDataField(masterDataType, dataField);
      onSave();
    } catch (e) {
      alert(e);
    }
  };

  const handleSave = async () => {
    if (dataField) {
      try {
        console.log("update", getUpdateInput(currentDataField));
        const res = await updateDataField(
          masterDataType,
          dataField,
          getUpdateInput(currentDataField)
        );
        alert(res);
        onSave();
      } catch (e) {
        alert(e);
      }
    } else {
      try {
        const res = await addDataField(
          masterDataType,
          getCreateInput(currentDataField)
        );
        onSave();
      } catch (e) {
        alert(e);
      }
    }
  };

  const handleChangeType = (type: DataFieldType) => {
    setCurrentDataField({
      ...currentDataField,
      type,
    });
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentDataField({
      ...currentDataField,
      text: e.target.value,
    });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentDataField({
      ...currentDataField,
      description: e.target.value,
    });
  };

  return (
    <Paper
      sx={{ p: ".5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <DataFieldTypeSelect
          type={currentDataField?.type}
          onChange={handleChangeType}
        />
        <TextField
          label={"Bezeichnung"}
          value={currentDataField?.text || ""}
          onChange={handleTextChange}
        />
        <TextField
          label={"Beschreibung (optional)"}
          value={currentDataField?.description || ""}
          onChange={handleDescriptionChange}
        />
        {currentDataField?.type === "Select" && (
          <SelectOptionsComponent
            value={currentDataField?.selectOptions || []}
            onChange={(so) =>
              //TODO
              //@ts-ignore Partial<XYZ> does not propagate...
              setCurrentDataField({ ...currentDataField, selectOptions: so })
            }
          />
        )}
      </Box>
      <Box>
        <Button onClick={handleSave}>
          {dataField ? "Speichern" : "Hinzufügen"}
        </Button>
        {dataField && (
          <Button color="error" onClick={handleDelete}>
            Löschen
          </Button>
        )}
        <Button onClick={handleCancel}>Zurücksetzen</Button>
      </Box>
    </Paper>
  );
}

function getCreateInput(
  dataField: Partial<FullDataField>
): Prisma.DataFieldCreateInput {
  if (!dataField?.type || !dataField?.text)
    throw new Error("missing attributes");
  return {
    type: dataField.type,
    text: dataField.text,
    required: dataField.required,
    description: dataField.description,
    selectOptions: { create: dataField.selectOptions },
  };
}

function getUpdateInput(
  dataField: Partial<FullDataField>
): Prisma.MasterDataTypeUpdateInput {
  return {
    dataFields: {
      update: {
        where: { id: dataField.id },
        data: {
          required: dataField.required || undefined,
          description: dataField.description || undefined,
          text: dataField.text || undefined,
          type: dataField.type || undefined,
          selectOptions: dataField.selectOptions
            ? {
                create: dataField.selectOptions,
              }
            : undefined,
        },
      },
    },
  };
}
