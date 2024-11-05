import DataFields from "@/components/masterDataTypes/dataFields";
import EditDataField from "@/components/masterDataTypes/editDataField";
import NewMasterdataTypeDialog from "@/components/masterDataTypes/newMasterDataTypeDialog";
import useToast from "@/components/notifications/notificationContext";
import masterDataTypes from "@/pages/masterDataTypes";
import { FullMasterDataType } from "@/types/prismaHelperTypes";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { deleteMasterDataType } from "@/utils/masterDataUtils";
import { Add, Sledding } from "@mui/icons-material";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function MasterDataTypesComponent() {
  const { user } = useUserData();
  const { masterDataTypes, mutate: mutateMasterDataTypes } =
    useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // TODO: Change this ugly hacky thing
  useEffect(() => {
    if (!selectedMdt) return;

    const newSelMdt = masterDataTypes.find(
      (mdt) => mdt.name === selectedMdt.name
    );

    setSelectedMdt(newSelMdt);
  }, [masterDataTypes]);

  const { addToast } = useToast();

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  console.log(selectedMdt?.dataFields);

  const onCancel = () => {};

  const onDelete = async () => {
    try {
      const res = await deleteMasterDataType(selectedMdt);
      addToast({
        message: `Stammdatenart ${selectedMdt.name} gelöscht.`,
        severity: "success",
      });
      setSelectedMdt(undefined);
      mutateMasterDataTypes();
    } catch (e) {
      addToast({
        message: `Fehler: ${e}`,
        severity: "error",
      });
    }
  };

  const onSave = () => {};

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
            <Typography variant="h5">Datenfelder:</Typography>
            <DataFields
              masterDataType={selectedMdt}
              onChange={mutateMasterDataTypes}
            />
            <Typography variant="h5">Neues Datenfeld hinzufügen:</Typography>
            <EditDataField
              masterDataType={selectedMdt}
              dataField={undefined}
              onSave={() => mutateMasterDataTypes()}
            />
          </Box>
        )}

        <Button onClick={onSave}>Speichern</Button>
        <Button onClick={onDelete} color="error">
          Löschen
        </Button>
        <Button onClick={onCancel}>Zurücksetzen</Button>
      </Box>
      <NewMasterdataTypeDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          mutateMasterDataTypes();
        }}
      />
    </>
  );
}
