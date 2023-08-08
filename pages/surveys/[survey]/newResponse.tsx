import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../../utils/swrConfig";
import survey, { ISurvey } from "../../api/surveys/[survey]";
import ErrorPage from "../../../components/utilityComponents/error";
import Loading from "../../../components/utilityComponents/loadingMainContent";
import ResponseComponent from "../../../components/response/responseComponent";
import { useEffect } from "react";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;
  const { data, isLoading, error, mutate } = useSWR<ISurvey>(
    `/api/surveys/${id}`,
    fetcher
  );

  useEffect(() => console.log(data), [data]);

  if (isLoading) return <Loading />;

  if (error || data?.error) return <ErrorPage message={error || data.error} />;

  return <ResponseComponent survey={data.survey} onChange={mutate} />;
}

export default function EditSurveyPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

