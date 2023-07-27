import Loading from "@/components/utilityComponents/loadingMainContent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
import useSWR from "swr";

type SurveyStatsComponentProps = {
  survey: FullSurvey;
};

export default function SurveyStatsComponent({
  survey,
}: SurveyStatsComponentProps) {
  const { data, isLoading, error } = useSWR(
    `/api/surveys/${survey.id}/responses`,
    fetcher
  );

  if (isLoading) return <Loading />;

  console.log(data);

  return <>SurveyStatsComponent</>;
}
