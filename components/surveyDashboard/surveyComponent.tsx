import { Delete, Edit, FileDownload } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma, Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { SurveyExport } from "@/utils/importExport";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { FetchError, apiDelete } from "@/utils/fetchApiUtils";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import useToast from "@/components/notifications/notificationContext";
import { useUserData } from "@/utils/authUtils";

export interface SurveyComponentProps {
  survey: Prisma.SurveyGetPayload<{
    include: { questions: { include: { selectOptions: true } } };
  }>;
  onChange: () => void;
}

export default function SurveyComponent({
  survey,
  onChange,
}: SurveyComponentProps) {
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { user } = useUserData();

  const router = useRouter();

  function handleDelete() {
    setDeleteOpen(true);
  }

  async function deleteThisSurvey() {
    const res = await apiDelete<ISurvey>(`/api/surveys/${survey.id}`);
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Fehler beim Löschen: ${res.error}`,
          severity: "error",
        });
      else
        addToast({
          message: `${res.survey.name || "Survey"} gelöscht`,
          severity: "success",
        });
    }
    onChange();
  }

  function handleExport() {
    const element = document.createElement("a");
    const surveyExport = new SurveyExport(survey);
    const file = new Blob([surveyExport.toString()], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = survey.name + ".survey.json";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Paper sx={{ p: ".5rem" }} elevation={3}>
        <Typography variant="h5">{survey.name}</Typography>
        <Typography sx={{ marginBottom: "1rem" }}>
          {survey.description}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ marginRight: ".5rem" }}
          disabled={
            user?.role !== Role.ADMIN &&
            survey.organizationId !== user.organizationId
          }
          onClick={() => router.push(`/surveys/${survey.id}/edit`)}
        >
          Bearbeiten
        </Button>
        <Button
          variant="outlined"
          startIcon={<Delete />}
          sx={{ marginRight: ".5rem" }}
          onClick={handleDelete}
          disabled={
            user?.role !== Role.ADMIN &&
            survey.organizationId !== user.organizationId
          }
        >
          Löschen
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          sx={{ marginRight: ".5rem" }}
          onClick={handleExport}
        >
          Exportieren
        </Button>
      </Paper>

      <ConfirmDialog
        title={"Erhebung Löschen?"}
        body={
          "Sind Sie sicher, dass sie diese Erhebung löschen wollen? Dies kann nicht rückgängig gemacht werden."
        }
        open={deleteOpen}
        onConfirm={deleteThisSurvey}
        onCancel={() => {
          setDeleteOpen(false);
          onChange();
        }}
      />
    </Box>
  );
}
