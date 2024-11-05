import { FullMasterData, FullMasterDataType } from "@/types/prismaHelperTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MasterDataType, Prisma } from "@prisma/client";
import { useState } from "react";

interface MasterDataDialogProps {
  initialMasterData?: FullMasterData;
  open: boolean;
  onClose: () => void;
  masterDataType: FullMasterDataType;
}

export default function MasterDataDialog({
  initialMasterData,
  open,
  onClose,
  masterDataType,
}: MasterDataDialogProps) {
  const title = initialMasterData
    ? `${masterDataType?.name} ${initialMasterData.number}`
    : `Neu: ${masterDataType?.name}`;

  const [masterData, setMasterData] =
    useState<Partial<FullMasterData>>(initialMasterData);

  const handleSave = () => {};

  const handleCancel = () => {
    setMasterData(initialMasterData);
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {masterDataType?.dataFields?.map((df) => (
          <>{df.text}</>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}

