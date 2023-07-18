import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import useNotification from "@/components/utilityComponents/notificationContext";
import { IOrganizations } from "@/pages/api/organizations";

export interface AddOrgMenuProps {
  open: boolean;
  onClose: () => void;
}

const AddOrgMenu = ({ open, onClose }: AddOrgMenuProps) => {
  const [name, updateName] = useState<string>("");
  const { addAlert } = useNotification();

  function handleSave() {
    fetch("/api/organizations", {
      body: JSON.stringify({ name }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const response = (await res.json()) as IOrganizations;
        if (res.status === 200)
          addAlert({
            message: `${response.organization.name} hinzugefügt`,
            severity: "success",
          });
        else
          addAlert({
            message: `Fehler beim Hinzufügen der Organisation: ${
              response.error || res.statusText
            }}`,
            severity: "error",
          });
      })
      .catch((err) => {
        addAlert({
          message: `Es ist ein Fehler aufgetreten: ${err}`,
          severity: "error",
        });
      });
    onClose();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    updateName(e.currentTarget.value);
  }

  function handleCancel() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Neue Organisation hinzufügen</DialogTitle>
      <DialogContent>
        <TextField value={name} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Hinzufügen</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrgMenu;
