import DataFieldTypeSelect from "@/components/masterDataTypes/dataFieldTypeSelect";
import { FullDataField, FullMasterDataType } from "@/types/prismaHelperTypes";
import { addDataField } from "@/utils/masterDataUtils";
import {
  Box,
  Button,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DataFieldType, Prisma } from "@prisma/client";
import { ChangeEvent, useState } from "react";

interface EditDataFieldProps {
  masterDataType: FullMasterDataType;
  dataField?: FullDataField;
}

export default function EditDataField({
  masterDataType,
  dataField,
}: EditDataFieldProps) {
  const [currentDataField, setCurrentDataField] =
    useState<Partial<FullDataField>>(dataField);

  const onCancel = () => {
    setCurrentDataField(dataField);
  };

  console.log(currentDataField);

  const onSave = async () => {
    if (dataField) {
    } else {
      try {
        const res = await addDataField(
          masterDataType,
          getCreateInput(currentDataField)
        );
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

  return (
    <Paper sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <DataFieldTypeSelect
          type={currentDataField?.type}
          onChange={handleChangeType}
        />
        <TextField value={currentDataField?.text} onChange={handleTextChange} />
      </Box>
      <Box>
        <Button onClick={onSave}>Speichern</Button>
        <Button onClick={onCancel}>Zurücksetzen</Button>
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

