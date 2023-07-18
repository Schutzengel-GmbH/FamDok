import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Caregiver, Disability, Education, Gender } from "@prisma/client";
import { useState } from "react";
import GenderPickComponent from "./pickComponents/genderPickComponent";
import EducationPickComponent from "./pickComponents/educationPickComponent";
import BooleanOrUndefinedPickComponent from "./pickComponents/yesNoPickComponent";
import DisabilityPickComponent from "./pickComponents/disabilityPickComponent";
import DatePickerComponent from "../utilityComponents/datePickerComponent";

interface EditCaregiverDialogProps {
  initialCaregiver?: Partial<Caregiver>;
  onSave: (caregiver: Partial<Caregiver>) => void;
  onClose: () => void;
  open: boolean;
}

export default function EditCaregiverDialog({
  initialCaregiver,
  onClose,
  onSave,
  open,
}: EditCaregiverDialogProps) {
  const [caregiver, setCaregiver] = useState<Partial<Caregiver>>(
    initialCaregiver ?? {}
  );

  function handleSave() {
    onSave(caregiver);
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
        {initialCaregiver
          ? "Bezugsperson bearbeiten"
          : "Bezugsperson erstellen"}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <DatePickerComponent
          sx={{ marginTop: "1rem" }}
          label="Geburtsdatum"
          currentAnswer={caregiver.dateOfBirth}
          onChange={(v) => setCaregiver({ ...caregiver, dateOfBirth: v })}
        />
        <GenderPickComponent
          sx={{ marginTop: "1rem" }}
          value={caregiver.gender}
          onChange={(gender) => setCaregiver({ ...caregiver, gender })}
        />
        <BooleanOrUndefinedPickComponent
          sx={{ marginTop: "1rem" }}
          title={"Migrationshintergrund"}
          value={caregiver.migrationBackground ?? undefined}
          onChange={(migrationBackground) =>
            setCaregiver({ ...caregiver, migrationBackground })
          }
        />
        <EducationPickComponent
          sx={{ marginTop: "1rem" }}
          value={caregiver.education ?? undefined}
          onChange={(education) =>
            setCaregiver({ ...caregiver, education: education })
          }
        />
        <DisabilityPickComponent
          sx={{ marginTop: "1rem" }}
          value={caregiver.disability ?? undefined}
          onChange={(disability) => setCaregiver({ ...caregiver, disability })}
        />
        <BooleanOrUndefinedPickComponent
          sx={{ marginTop: "1rem" }}
          title={"Psychiatrische Diagnose"}
          value={caregiver.psychDiagosis ?? undefined}
          onChange={(psychDiagosis) =>
            setCaregiver({ ...caregiver, psychDiagosis })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </DialogActions>
    </Dialog>
  );
}
