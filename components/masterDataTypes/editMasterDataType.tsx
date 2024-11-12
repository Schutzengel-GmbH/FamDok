import EditStringDialog from "@/components/editSurvey/editStringDialog";
import DataFieldListItem from "@/components/masterDataTypes/dataFieldListItem";
import useToast from "@/components/notifications/notificationContext";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import { FullMasterDataType } from "@/types/prismaHelperTypes";
import { updateMasterDataType } from "@/utils/masterDataUtils";
import { Edit } from "@mui/icons-material";
import { Alert, Box, IconButton, List, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

interface EditMasterDataTypeProps {
  masterDataType: FullMasterDataType;
  onChange: () => void;
}

export default function EditMasterDataType({
  masterDataType,
  onChange,
}: EditMasterDataTypeProps) {
  const [error, setError] = useState<string>("");
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [name, setName] = useState<string>(masterDataType.name);
  const [editNameOpen, setEditNameOpen] = useState<boolean>(false);

  const { addToast } = useToast();
  const router = useRouter();

  const handleSave = async () => {
    try {
      const res = await updateMasterDataType(masterDataType, { name });
      addToast({ message: "Name geändert", severity: "success" });
      setUnsavedChanges(false);
    } catch (e) {
      addToast({ message: `Fehler: ${e}`, severity: "error" });
    }
    onChange();
  };

  const handleCancel = () => {
    router.push("/masterDataTypes");
  };

  return (
    <Box>
      <UnsavedChangesComponent
        unsavedChanges={unsavedChanges}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {error && (
        <Alert severity="error">
          <strong>Fehler: </strong>
          {error}
        </Alert>
      )}
      <Typography variant="h5">
        {name}{" "}
        <IconButton onClick={() => setEditNameOpen(true)}>
          <Edit />
        </IconButton>
      </Typography>
      <List>
        {masterDataType.dataFields.map((df) => (
          <DataFieldListItem dataField={df} onChange={onChange} />
        ))}
      </List>

      <EditStringDialog
        title={"Namen der Survey ändern"}
        open={editNameOpen}
        initialValue={name}
        valueChanged={(n) => {
          setName(n);
          setUnsavedChanges(masterDataType.name !== n);
        }}
        onClose={() => setEditNameOpen(false)}
      />
    </Box>
  );
}

