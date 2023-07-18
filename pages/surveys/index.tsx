import Error from "next/error";
import SessionReact from "supertokens-auth-react/recipe/session";
import useSWR from "swr";
import { ISurveys } from "../api/surveys";
import Loading from "../../components/utilityComponents/loadingMainContent";
import { fetcher } from "../../utils/swrConfig";
import Surveys from "../../components/surveys/surveys";

function ProtectedPage() {
  const { data, isLoading, error } = useSWR<ISurveys>(`/api/surveys`, fetcher);

  if (isLoading) return <Loading />;

  if (error) return <Error statusCode={500} title={error} />;

  console.log(data);

  return <Surveys surveys={data.surveys} />;
}

export default function SurveyDashboardPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
