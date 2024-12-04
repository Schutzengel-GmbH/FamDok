import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../../utils/swrConfig";
import { ISurvey } from "../../api/surveys/[survey]";
import ErrorPage from "../../../components/utilityComponents/error";
import Loading from "../../../components/utilityComponents/loadingMainContent";
import ResponseComponent from "../../../components/response/responseComponent";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id, number: familyNumber } = router.query;
  const { data, isLoading, error, mutate } = useSWR<ISurvey>(
    `/api/surveys/${id}`,
    fetcher
  );

  if (isLoading) return <Loading />;

  if (error || data?.error) return <ErrorPage message={error || data.error} />;

  return (
    <ResponseComponent
      //@ts-ignore
      survey={data.survey}
      onChange={mutate}
      familyNumber={parseInt(familyNumber as string) || undefined}
    />
  );
}

export default function EditSurveyPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

