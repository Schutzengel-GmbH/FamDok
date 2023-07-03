import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export interface ErrorDialogProps {
  title?: string;
  body?: string | JSX.Element;
  open: boolean;
  onOK: () => void;
}

export default function ErrorDialog({
  title,
  body,
  open,
  onOK,
}: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onOK();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>{title ? title : "Fehler"}</DialogTitle>
      <DialogContent>
        <Typography>
          {body ? body : "Es ist ein unerwarteter Fehler aufgetreten"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOK}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
