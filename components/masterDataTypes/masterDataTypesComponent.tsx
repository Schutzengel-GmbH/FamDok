import NewMasterdataTypeDialog from "@/components/masterDataTypes/newMasterDataTypeDialog";
import useToast from "@/components/notifications/notificationContext";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { deleteMasterDataType } from "@/utils/masterDataUtils";
import { Add } from "@mui/icons-material";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MasterDataTypesComponent() {
  const { user } = useUserData();
  const { masterDataTypes, mutate: mutateMasterDataTypes } =
    useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const router = useRouter();

  const { addToast } = useToast();

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  console.log(selectedMdt?.dataFields);

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
            <Typography variant="h5">Datenfelder:</Typography>
            {selectedMdt &&
              selectedMdt.dataFields.map((df) => (
                <Box>
                  <Typography>{df.text}</Typography>
                  <Typography>{df.type}</Typography>
                </Box>
              ))}
          </Box>
        )}

        <Button onClick={onEdit} disabled={!selectedMdt}>
          Bearbeiten
        </Button>
        <Button onClick={onDelete} color="error" disabled={!selectedMdt}>
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
    </>
  );
}

