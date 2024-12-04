import SelectOptionsComponent from "@/components/editSurvey/selectOptionsComponent";
import CollectionTypeSelect from "@/components/masterDataTypes/collectionTypeSelect";
import DataFieldTypeSelect from "@/components/masterDataTypes/dataFieldTypeSelect";
import useToast from "@/components/notifications/notificationContext";
import { FullDataField } from "@/types/prismaHelperTypes";
import { addDataField, updateDataField } from "@/utils/masterDataUtils";
import { Save, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { CollectionType, DataFieldType, Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

interface EditDataFieldDialogProps {
  dataField?: FullDataField;
  masterDataTypeId?: string;
  open: boolean;
  onClose: () => void;
}

export interface IDataFieldState {
  text: string;
  description: string;
  selectMultiple?: boolean;
  collectionType?: CollectionType;
  collectionMaxSize?: number;
  selectOptions?: {
    id?: string;
    value: string;
    isOpen?: boolean;
    info?: string;
  }[];
  required: boolean;
  type: DataFieldType;
}

export default function EditDataFieldDialog({
  dataField,
  masterDataTypeId,
  open,
  onClose,
}: EditDataFieldDialogProps) {
  const [dataFieldState, setDataFieldState] = useState<IDataFieldState>({
    text: dataField?.text || undefined,
    description: dataField?.description || undefined,
    collectionType: dataField?.collectionType || undefined,
    collectionMaxSize: dataField?.collectionMaxSize || undefined,
    selectMultiple: dataField?.selectMultiple || undefined,
    selectOptions: dataField?.selectOptions || [],
    required: dataField?.required || undefined,
    type: dataField?.type || undefined,
  });

  const { addToast } = useToast();

  const saveDisabled = () => {
    if (dataFieldState.type === "Collection")
      return !dataFieldState.text || !dataFieldState.collectionType;
    return !dataFieldState.text;
  };
  const [collectionMaxSet, setCollectionMaxSet] = useState<boolean>(false);

  const handleSave = async () => {
    if (saveDisabled()) return;

    if (dataField)
      try {
        const res = await updateDataField(
          dataField,
          {
            text: dataFieldState.text,
            description: dataFieldState.description,
            required: dataFieldState.required,
            type: dataFieldState.type,
            selectMultiple: dataFieldState.selectMultiple,
          },
          dataFieldState.selectOptions.length > 0
            ? dataFieldState.selectOptions
            : undefined
        );
        addToast({ message: "Datenfeld geändert", severity: "success" });
        handleClose();
      } catch (e) {
        addToast({ message: `Fehler: ${e}`, severity: "error" });
      }

    if (!dataField) {
      if (!masterDataTypeId) {
        addToast({
          message: "Fehler: kein Stammdatensatz gefunden (no masterDataTypeId)",
          severity: "error",
        });
        return;
      }

      try {
        const res = await addDataField(masterDataTypeId, {
          ...dataFieldState,
          selectOptions: { create: dataFieldState.selectOptions },
        });
        addToast({ message: "Datenfeld geändert", severity: "success" });
        handleClose();
      } catch (e) {
        addToast({ message: `Fehler: ${e}`, severity: "error" });
      }
    }
  };

  const handleClose = () => {
    setDataFieldState({
      text: dataField?.text || undefined,
      description: dataField?.description || undefined,
      collectionType: dataField?.collectionType || undefined,
      collectionMaxSize: dataField?.collectionMaxSize || undefined,
      selectMultiple: dataField?.selectMultiple || undefined,
      selectOptions: dataField?.selectOptions || [],
      required: dataField?.required || undefined,
      type: dataField?.type || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {dataField ? "Datenfeld bearbeiten" : "Datenfeld erstellen"}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            mt: "1rem",
          }}
        >
          <TextField
            label={"Bezeichnung"}
            value={dataFieldState.text || ""}
            onChange={(e) =>
              setDataFieldState({ ...dataFieldState, text: e.target.value })
            }
          />
          <DataFieldTypeSelect
            type={(dataFieldState.type as DataFieldType) || undefined}
            onChange={(t) => setDataFieldState({ ...dataFieldState, type: t })}
          />
          {dataFieldState.type === "Collection" && (
            <>
              <CollectionTypeSelect
                collectionType={dataFieldState.collectionType || undefined}
                onChange={(ct) =>
                  setDataFieldState({ ...dataFieldState, collectionType: ct })
                }
              />
            </>
          )}
          <TextField
            label={"Beschreibung (optional)"}
            value={dataFieldState.description || ""}
            onChange={(e) =>
              setDataFieldState({
                ...dataFieldState,
                description: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={dataFieldState.required as boolean}
                onChange={(e) => {
                  setDataFieldState({
                    ...dataFieldState,
                    required: e.target.checked,
                  });
                }}
              />
            }
            label={"Eingabe erforderlich?"}
          />
          {dataFieldState.type === "Select" && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={dataFieldState.selectMultiple as boolean}
                    onChange={(e) => {
                      setDataFieldState({
                        ...dataFieldState,
                        selectMultiple: e.target.checked,
                      });
                    }}
                  />
                }
                label={"Mehrere Antworten zulassen"}
              />
              <SelectOptionsComponent
                value={dataFieldState.selectOptions}
                onChange={(s) =>
                  setDataFieldState({ ...dataFieldState, selectOptions: s })
                }
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} disabled={saveDisabled()}>
          <Save /> Speichern
        </Button>
        <Button onClick={handleClose}>
          <Cancel /> Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

