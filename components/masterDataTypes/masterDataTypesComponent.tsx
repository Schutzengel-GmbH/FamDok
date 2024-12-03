import NewMasterdataTypeDialog from "@/components/masterDataTypes/newMasterDataTypeDialog";
import useToast from "@/components/notifications/notificationContext";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import {
  deleteMasterDataType,
  getDataFieldTypeName,
} from "@/utils/masterDataUtils";
import { Add } from "@mui/icons-material";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MasterDataTypesComponent() {
  const { user } = useUserData();
  const { masterDataTypes, mutate: mutateMasterDataTypes } =
    useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  const { addToast } = useToast();

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const onEdit = () => {
    router.push(`/masterDataTypes/${selectedMdt.id}/edit`);
  };

  const onDelete = async () => {
    try {
      const res = await deleteMasterDataType(selectedMdt);
      addToast({
        message: `Stammdatenart ${selectedMdt.name} gelöscht.`,
        severity: "success",
      });
      setSelectedMdt(undefined);
      mutateMasterDataTypes();
      setDeleteDialogOpen(false);
    } catch (e) {
      addToast({
        message: `Fehler: ${e}`,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "baseline",
          }}
        >
          <Select
            sx={{ mb: "2rem", flexGrow: "1" }}
            onChange={handleMdtChange}
            value={selectedMdt ? selectedMdt.name : ""}
          >
            {masterDataTypes?.map((mdt) => (
              <MenuItem value={mdt.name}>{mdt.name}</MenuItem>
            ))}
          </Select>
          <Button onClick={handleAdd}>
            <Add />
          </Button>
        </Box>

        {selectedMdt && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography variant="h4">{selectedMdt.name}</Typography>
            <Typography variant="h5">Datenfelder (Datentyp):</Typography>
            {selectedMdt &&
              selectedMdt.dataFields.map((df) => (
                <>
                  <Typography>
                    {df.text} {"("}
                    {getDataFieldTypeName(df.type)}
                    {")"}
                    {df.required ? ", Pflichtangabe" : ""}
                    {df.description ? `, Beschreibung: ${df.description}` : ""}
                  </Typography>
                </>
              ))}
          </Box>
        )}

        <Button onClick={onEdit} disabled={!selectedMdt}>
          Bearbeiten
        </Button>
        <Button
          onClick={() => setDeleteDialogOpen(true)}
          color="error"
          disabled={!selectedMdt}
        >
          Löschen
        </Button>
      </Box>

      <NewMasterdataTypeDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          mutateMasterDataTypes();
        }}
      />

      <ConfirmDialog
        title={`Stammdatenart ${selectedMdt?.name} löschen?`}
        body={`Soll die Stammdatenart ${selectedMdt?.name} endgültig gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden, alle Datensätze gehen verloren`}
        open={deleteDialogOpen}
        onConfirm={onDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

