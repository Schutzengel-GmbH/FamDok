import { FullSurvey } from "@/types/prismaHelperTypes";
import ResponsesTable from "@/components/surveyStats/responsesTable";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import CountingTable from "@/components/surveyStats/countingTable";

type SurveyStatsComponentProps = {
  survey: FullSurvey;
};

type StatsSelector =
  | ""
  | "ALL_ANSWERS"
  | "NUM_ANSWERS_USER"
  | "NUM_ANSWERS_SUBORG";

export default function SurveyStatsComponent({
  survey,
}: SurveyStatsComponentProps) {
  const [selectedStats, setSelectedStats] = useState<StatsSelector>("");

  function handleSelectStats(e: SelectChangeEvent) {
    setSelectedStats(e.target.value as StatsSelector);
  }

  return (
    <Box>
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
      </Select>
      <Box>
        {selectedStats === "ALL_ANSWERS" && <ResponsesTable survey={survey} />}
        {selectedStats === "NUM_ANSWERS_USER" && (
          <CountingTable surveyId={survey.id} />
        )}
        {selectedStats === "NUM_ANSWERS_SUBORG" && <>NUM_ANSWERS_SUBORG</>}
      </Box>
    </Box>
  );
}
