import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type InputDialogProps<TConfirm = void, TCancel = void> = {
  title: string;
  body?: string | JSX.Element;
  open: boolean;
  initialValue?: string;
  onConfirm: (value: string) => TConfirm;
  onCancel: (value?: string) => TCancel;
};

export default function InputDialog({
  open,
  title,
  body,
  initialValue,
  onConfirm,
  onCancel,
}: InputDialogProps) {
  const [curValue, setCurValue] = useState<string>(initialValue);

  function handleConfirm() {
    setCurValue("");
    onConfirm(curValue);
  }

  function handleCancel() {
    setCurValue("");
    onCancel(curValue);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {body && <Typography>{body}</Typography>}
        <Input
          value={curValue}
          onChange={(e) => setCurValue(e.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Bestätigen</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
