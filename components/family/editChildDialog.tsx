import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Child } from "@prisma/client";
import { useState } from "react";
import GenderPickComponent from "@/components/family/pickComponents/genderPickComponent";
import BooleanOrUndefinedPickComponent from "@/components/family/pickComponents/yesNoPickComponent";
import DisabilityPickComponent from "@/components/family/pickComponents/disabilityPickComponent";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";

interface EditChildDialogProps {
  initialChild?: Partial<Child>;
  onSave: (child: Partial<Child>) => void;
  onClose: () => void;
  open: boolean;
}

export default function EditChildDialog({
  initialChild,
  onClose,
  onSave,
  open,
}: EditChildDialogProps) {
  const [child, setChild] = useState<Partial<Child>>(initialChild ?? {});

  function handleSave() {
    onSave(child);
    onClose();
  }
  function handleCancel() {
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>
        {initialChild ? "Kind bearbeiten" : "Kind erstellen"}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <DatePickerComponent
          sx={{ marginTop: "1rem" }}
          label="Geburtsdatum"
          currentAnswer={child.dateOfBirth}
          onChange={(v) => setChild({ ...child, dateOfBirth: v })}
        />
        <GenderPickComponent
          sx={{ marginTop: "1rem" }}
          value={child.gender}
          onChange={(gender) => setChild({ ...child, gender })}
        />
        <DisabilityPickComponent
          sx={{ marginTop: "1rem" }}
          value={child.disability ?? undefined}
          onChange={(disability) => setChild({ ...child, disability })}
        />
        <BooleanOrUndefinedPickComponent
          sx={{ marginTop: "1rem" }}
          title={"Psychiatrische Diagnose"}
          value={child.psychDiagosis ?? undefined}
          onChange={(psychDiagosis) => setChild({ ...child, psychDiagosis })}
        />
        <BooleanOrUndefinedPickComponent
          sx={{ marginTop: "1rem" }}
          title={"Mehrling (Zwillinge, Drillinge, ...)"}
          value={child.isMultiple ?? undefined}
          onChange={(isMultiple) => setChild({ ...child, isMultiple })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
