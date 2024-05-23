import { FullSurvey } from "@/types/prismaHelperTypes";
import ResponsesTable from "@/components/surveyStats/responsesTable";
import {
  Box,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ResponsesPerUserTable from "@/components/surveyStats/responsesPerUser";
import ResponsesPerSubOrg from "./responsesPerSubOrg";
import ResponsesWhereAnswerTable from "@/components/surveyStats/responsesWhereAnswerTable";
import { useRouter } from "next/router";
import ResponsesTabulator from "./responsesTabulator";

type SurveyStatsComponentProps = {
  survey: FullSurvey;
};

export type StatsSelector =
  | ""
  | "ALL_ANSWERS"
  | "NUM_ANSWERS_USER"
  | "NUM_ANSWERS_SUBORG"
  | "RESPONSES_WHERE_ANSWER"
  | "ALL_ANSWERS_TABULATOR";

export default function SurveyStatsComponent({
  survey,
}: SurveyStatsComponentProps) {
  const { query } = useRouter();
  const [selectedStats, setSelectedStats] = useState<StatsSelector>(
    (query.selectedStats as StatsSelector) || ""
  );
  function handleSelectStats(e: SelectChangeEvent) {
    setSelectedStats(e.target.value as StatsSelector);
  }

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "min-content 70vh", rowGap: "1rem" }}>
      <Paper
        elevation={3}
        sx={{
          p: ".5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography>Ansicht auswählen:</Typography>
        <Select
          sx={{ mb: ".5rem" }}
          value={selectedStats}
          onChange={handleSelectStats}
        >
          <MenuItem value="ALL_ANSWERS">Alle Antworten</MenuItem>
          <MenuItem value="NUM_ANSWERS_USER">Antworten pro User</MenuItem>
          <MenuItem value="NUM_ANSWERS_SUBORG">
            Antworten pro Unterorganisation
          </MenuItem>
          <MenuItem value="RESPONSES_WHERE_ANSWER">Nach Antworten</MenuItem>
          <MenuItem value="ALL_ANSWERS_TABULATOR">Alle Antworten (Tabulator)</MenuItem>
        </Select>
      </Paper>
      {selectedStats === "ALL_ANSWERS" && <ResponsesTable survey={survey} />}
      {selectedStats === "NUM_ANSWERS_USER" && (
        <ResponsesPerUserTable surveyId={survey.id} />
      )}
      {selectedStats === "NUM_ANSWERS_SUBORG" && (
        <ResponsesPerSubOrg survey={survey} />
      )}
      {selectedStats === "RESPONSES_WHERE_ANSWER" && (
        <ResponsesWhereAnswerTable survey={survey} />
      )}
      {selectedStats === "ALL_ANSWERS_TABULATOR" && <ResponsesTabulator survey={survey} />}
    </Box>
  );
}