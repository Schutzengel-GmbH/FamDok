import { PartialFamily } from "@/components/family/familyDialog";
import useToast from "@/components/notifications/notificationContext";
import { useConfig } from "@/components/utilityComponents/conficContext";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import { ApiResponseFamily } from "@/pages/api/families/[family]";
import { useSurvey } from "@/utils/apiHooks";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type EndOfCareDialogProps = {
  open: boolean;
  family: PartialFamily;
  onClose: () => void;
};

export default function EndOfCareDialog({
  open,
  family,
  onClose,
}: EndOfCareDialogProps) {
  const [date, setDate] = useState<Date>(family.endOfCare);
  const { endOfCareAutoSurveyId } = useConfig();
  const { survey } = useSurvey(endOfCareAutoSurveyId);
  const router = useRouter();
  const { addToast } = useToast();

  function handleCancel() {
    onClose();
  }

  async function handleSave() {
    onClose();

    const res = await apiPostJson<
      ApiResponseFamily,
      { familyUpdate: Prisma.FamilyUpdateInput }
    >(`/api/families/${family.id}`, { familyUpdate: { endOfCare: date } });

    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Fehler: ${res.error}`,
          severity: "error",
        });

      addToast({
        message: `Familie ${res.family?.number} abgeschlossen.`,
        severity: "success",
      });
    }

    if (survey && family)
      router.push(`/surveys/${survey.id}/newResponse?number=${family.number}`);
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
      }}
    >
      <DialogTitle>Betreuung beenden?</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
      >
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
