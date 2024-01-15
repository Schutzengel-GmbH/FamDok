import { Add, FileUpload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/utils/swrConfig";
import { ISurveys } from "@/pages/api/surveys";
import { useState } from "react";
import SurveyComponent from "@/components/surveyDashboard/surveyComponent";
import AddSurveyDialog from "@/components/surveyDashboard/addSurveyDialog";
import ImportSurveyDialog from "@/components/surveyDashboard/importSurveyDialog";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { useUserData } from "@/utils/authUtils";
import { Role } from "@prisma/client";

export default function SurveyDashboard() {
  const [addSurveyOpen, setAddSurveyOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const { data, isLoading, mutate } = useSWR<ISurveys>("/api/surveys", fetcher);

  const { user } = useUserData();

  function handleImport() {
    setImportOpen(true);
  }

  if (isLoading) return <Loading />;

  return (
    <Box>
      {data &&
        data.surveys.map((s) => (
          <SurveyComponent onChange={mutate} survey={s} key={s.id} />
        ))}
      <Button
        onClick={() => setAddSurveyOpen(true)}
        startIcon={<Add />}
        variant="outlined"
        sx={{ marginTop: "1rem" }}
      >
        Add
      </Button>

      <Button
        onClick={handleImport}
        startIcon={<FileUpload />}
        variant="outlined"
        sx={{ marginTop: "1rem", marginLeft: ".5rem" }}
      >
        Importieren
      </Button>

      <AddSurveyDialog
        open={addSurveyOpen}
        onClose={() => {
          setAddSurveyOpen(false);
          mutate();
        }}
      />

      <ImportSurveyDialog
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          mutate();
        }}
      />
    </Box>
  );
}

