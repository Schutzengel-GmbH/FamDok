import DashboardSurveyCard from "@/components/dashboards/dashboardSurveyCard";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { Box } from "@mui/material";

type DashboardMainPageProps = {
  surveys: FullSurvey[];
};

export default function DashboardMainPage({ surveys }: DashboardMainPageProps) {
  return (
    <Box>
      {surveys.map((s) => (
        <DashboardSurveyCard survey={s} />
      ))}
    </Box>
  );
}
