import { Add, FileUpload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "../../utils/swrConfig";
import { ISurveys } from "../../pages/api/surveys";
import { useState } from "react";
import SurveyComponent from "./surveyComponent";
import Working from "../utilityComponents/working";
import AddSurveyDialog from "./addSurveyDialog";

export default function SurveyDashboard() {
  const [addSurveyOpen, setAddSurveyOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const { data, isLoading, mutate } = useSWR<ISurveys>("/api/surveys", fetcher);

  function handleImport() {
    setImportOpen(true);
  }

  return (
    <Box>
      {data &&
        data.surveys?.map((s) => (
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

      {/* <ImportSurveyDialog
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          mutate();
        }}
      /> */}

      <Working open={isLoading} />
    </Box>
  );
}
