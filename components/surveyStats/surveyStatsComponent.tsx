import Loading from "@/components/utilityComponents/loadingMainContent";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
import useSWR from "swr";
import Error from "next/error";
import { Box } from "@mui/material";
import ResponsesTable from "@/components/surveyStats/responsesTable";

type SurveyStatsComponentProps = {
  survey: FullSurvey;
};

export default function SurveyStatsComponent({
  survey,
}: SurveyStatsComponentProps) {
  return <ResponsesTable survey={survey} />;
}
