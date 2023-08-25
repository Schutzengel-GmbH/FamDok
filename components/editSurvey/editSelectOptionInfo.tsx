import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

export type EditSelectOptionInfoProps = {
  initialInfo?: string;
  open: boolean;
  onSave: (info: string) => void;
  onClose: () => void;
};

export default function EditSelectOptionInfo({
  initialInfo,
  open,
  onClose,
  onSave,
}: EditSelectOptionInfoProps) {
  const [info, setInfo] = useState<string>(initialInfo ?? "");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInfo(e.target.value);
  }

  function handleSave() {
    onSave(info);
    onClose();
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Info bearbeiten</DialogTitle>
      <DialogContent>
        <TextField multiline minRows={3} value={info} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={onClose}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}

