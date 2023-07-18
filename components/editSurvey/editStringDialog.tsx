import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

export interface EditStringDialogProps {
  initialValue: string | undefined;
  title: string;
  text?: string;
  open: boolean;
  valueChanged: (newValue: string) => void;
  onClose: () => void;
}

export default function EditStringDialog({
  initialValue,
  title,
  text,
  open,
  onClose,
  valueChanged,
}: EditStringDialogProps) {
  const [string, setString] = useState<string>(initialValue || '');

  function handleClose() {
    setString(initialValue || '');
    onClose();
  }

  function handleSave() {
    valueChanged(string);
    onClose();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setString(e.currentTarget.value);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {text && <Typography>{text}</Typography>}
        <TextField value={string} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleClose}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
