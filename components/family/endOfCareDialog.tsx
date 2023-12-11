import { PartialFamily } from "@/components/family/familyDialog";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import { FullFamily } from "@/types/prismaHelperTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Family } from "@prisma/client";
import { useState } from "react";

type EndOfCareDialogProps = {
  open: boolean;
  family: PartialFamily;
  onClose: (end: boolean, date?: Date) => void;
};

export default function EndOfCareDialog({
  open,
  family,
  onClose,
}: EndOfCareDialogProps) {
  const [date, setDate] = useState<Date>(family.endOfCare);

  function handleCancel() {
    onClose(false);
  }

  function handleSave() {
    onClose(true, date);
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
      }}
    >
      <DialogTitle>Betreuung beenden?</DialogTitle>
      <DialogContent>
        <DatePickerComponent
          sx={{ marginTop: "1rem" }}
          label="Betreuung beendet zum"
          currentAnswer={date}
          onChange={setDate}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!date} onClick={handleSave}>
          Speichern
        </Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}

