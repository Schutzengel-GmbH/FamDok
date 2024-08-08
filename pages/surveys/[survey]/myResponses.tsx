import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { useUserData } from "@/utils/authUtils";
import { fetcher } from "@/utils/swrConfig";
import { Role } from "@prisma/client";
import useSWR from "swr";
import Error from "next/error";
import ResponsesTabulator from "@/components/surveyStats/responsesTabulator";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;
  const { user } = useUserData();

  const { data, isLoading, error } = useSWR<ISurvey>(
    user && id ? `/api/surveys/${id}` : undefined,
    fetcher
  );

  if (!user) return <Error statusCode={403} title="Forbidden" />;

  if (isLoading) return <Loading />;

  if (error || !data || !data.survey)
    return (
      <Error
        statusCode={error === "Not Found" ? 404 : 500}
        title={error || "Unbekannter Fehler"}
      />
    );

  return <ResponsesTabulator survey={data.survey} myResponses />;
}

export default function MyResponsesPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
