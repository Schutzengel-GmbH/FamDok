import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface FamilyNumberDialogProps {
  open: boolean;
  onClose: () => void;
  familyNumber: number | undefined;
}

export default function FamilyNumberDialog({
  open,
  onClose,
  familyNumber,
}: FamilyNumberDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onClose();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>Familie erstellt</DialogTitle>
      <DialogContent>
        {`Die Familie mit der Nummer ${familyNumber} wurde erfolgreich erstellt.`}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
