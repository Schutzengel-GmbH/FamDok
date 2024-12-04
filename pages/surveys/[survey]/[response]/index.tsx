import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import ResponseComponent from "@/components/response/responseComponent";
import { fetcher } from "@/utils/swrConfig";
import useSWR from "swr";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";
import { Alert } from "@mui/material";

function ProtectedPage() {
  const router = useRouter();
  const { survey: surveyId, response: responseId } = router.query;

  const {
    data: surveyData,
    isLoading: surveyIsLoading,
    error: surveyError,
  } = useSWR<ISurvey>(`/api/surveys/${surveyId}`, fetcher);

  const {
    data: responseData,
    isLoading: responseIsLoading,
    error: responseError,
    mutate,
  } = useSWR<IResponse>(
    `/api/surveys/${surveyId}/responses/${responseId}`,
    fetcher
  );

  if (responseIsLoading || surveyIsLoading) return <Loading />;

  if (responseError || surveyError)
    return <Alert severity="error">{surveyError || responseError}</Alert>;

  return (
    <ResponseComponent
      //@ts-ignore
      survey={surveyData.survey}
      initialResponse={responseData.response}
      onChange={mutate}
    />
  );
}

export default function EditResponsePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

