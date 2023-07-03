import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export type ConfirmDialogProps<TConfirm = void, TCancel = void> = {
  title: string;
  body: string | JSX.Element;
  open: boolean;
  onConfirm: () => TConfirm;
  onCancel: () => TCancel;
};

export default function ConfirmDialog({
  open,
  title,
  body,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm();
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{body}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Bestätigen</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
