import OrgSelect from "@/components/adminDashboard/orgSelect";
import useToast from "@/components/notifications/notificationContext";
import organizations from "@/pages/api/organizations";
import { useOrganizations } from "@/utils/apiHooks";
import { createMasterDataType } from "@/utils/masterDataUtils";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { MasterDataType } from "@prisma/client";
import { useState } from "react";

interface NewMasterdataTypeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NewMasterdataTypeDialog({
  open,
  onClose,
}: NewMasterdataTypeDialogProps) {
  const [masterDataType, setMasterDataType] = useState<Partial<MasterDataType>>(
    {}
  );

  const { organizations } = useOrganizations();

  const { addToast } = useToast();

  const handleSave = async () => {
    try {
      const res = await createMasterDataType({
        name: masterDataType.name,
        isLimitedToOrg: masterDataType.isLimitedToOrg,
        organization: masterDataType.isLimitedToOrg
          ? { connect: { id: masterDataType.organizationId } }
          : undefined,
      });

      addToast({
        message: `Stammdatenart ${masterDataType.name} erfolgreich erstellt.`,
        severity: "success",
      });
      setMasterDataType({});
      onClose();
    } catch (e) {
      addToast({
        message: `Fehler: ${e}`,
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", maxWidth: "800px" }}
        >
          <TextField
            sx={{ mt: ".5rem" }}
            label={"Name"}
            value={masterDataType.name}
            onChange={(e) =>
              setMasterDataType({ ...masterDataType, name: e.target.value })
            }
          />
          {/* <FormControlLabel
            label="Nur für eine Organisation"
            control={
              <Checkbox
                checked={masterDataType.isLimitedToOrg}
                onChange={(e) =>
                  setMasterDataType({
                    ...masterDataType,
                    isLimitedToOrg: e.target.checked,
                  })
                }
              />
            }
          /> */}
          {masterDataType.isLimitedToOrg && (
            <OrgSelect
              dontShowNoOrg
              dontShowNewOrg
              value={masterDataType.organizationId}
              onChange={(id) =>
                setMasterDataType({ ...masterDataType, organizationId: id })
              }
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}

