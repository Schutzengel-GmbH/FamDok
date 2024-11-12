import SelectOptionsComponent from "@/components/editSurvey/selectOptionsComponent";
import DataFieldTypeSelect from "@/components/masterDataTypes/dataFieldTypeSelect";
import useToast from "@/components/notifications/notificationContext";
import { FullDataField } from "@/types/prismaHelperTypes";
import { updateDataField } from "@/utils/masterDataUtils";
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
import { DataFieldType, Prisma } from "@prisma/client";
import { useState } from "react";

interface EditDataFieldDialogProps {
  dataField?: FullDataField;
  open: boolean;
  onClose: () => void;
}

export interface IDataFieldState {
  text: string;
  description: string;
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
  open,
  onClose,
}: EditDataFieldDialogProps) {
  const [dataFieldState, setDataFieldState] = useState<IDataFieldState>({
    text: dataField.text || undefined,
    description: dataField.description || undefined,
    selectOptions: dataField.selectOptions,
    required: dataField.required || undefined,
    type: dataField.type || undefined,
  });

  const { addToast } = useToast();

  const saveDisabled = () => false;
  const handleSave = async () => {
    if (saveDisabled()) return;
    try {
      const res = await updateDataField(
        dataField,
        {
          text: dataFieldState.text,
          description: dataFieldState.description,
          required: dataFieldState.required,
          type: dataFieldState.type,
        },
        dataFieldState.selectOptions.length > 0
          ? dataFieldState.selectOptions
          : undefined
      );
      addToast({ message: "Datenfeld geändert", severity: "success" });
      onClose();
    } catch (e) {
      addToast({ message: `Fehler: ${e}`, severity: "error" });
    }
  };
  const handleClose = () => {
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
            <SelectOptionsComponent
              value={dataFieldState.selectOptions}
              onChange={(s) =>
                setDataFieldState({ ...dataFieldState, selectOptions: s })
              }
            />
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

