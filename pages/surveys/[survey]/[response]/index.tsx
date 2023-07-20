import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import ResponseComponent from "@/components/response/responseComponent";
import { fetcher } from "@/utils/swrConfig";
import useSWR from "swr";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";

function ProtectedPage() {
  const router = useRouter();
  const { survey: surveyId, response: responseId } = router.query;

  const { data: surveyData, isLoading: surveyIsLoading } = useSWR<ISurvey>(
    `/api/surveys/${surveyId}`
  );

  const { data: responseData, isLoading: responseIsLoading } =
    useSWR<IResponse>(
      `/api/surveys/${surveyId}/responses/${responseId}`,
      fetcher
    );

  if (responseIsLoading || surveyIsLoading) return <Loading />;

  console.log(responseData);

  return (
    <ResponseComponent
      survey={surveyData.survey}
      initialResponse={responseData.response}
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
