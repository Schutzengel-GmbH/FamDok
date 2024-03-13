import ResponsesPerUser from "@/components/dashboards/responsesPerUser";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses, useSurveys } from "@/utils/apiHooks";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export default function Dashboard() {
  const [survey, setSurvey] = useState<FullSurvey>(null);
  const { surveys } = useSurveys();

  const { responses } = useResponses(survey?.id);

  function handleSelectSurvey(e: SelectChangeEvent) {
    setSurvey(surveys.find((s) => s.id === e.target.value));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Box>
        <Select value={survey?.id || "Keine"} onChange={handleSelectSurvey}>
          <MenuItem value={"Keine"}>Keine</MenuItem>
          {surveys?.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <ResponsesPerUser survey={survey} responses={responses} />
      </Box>
    </Box>
  );
}
