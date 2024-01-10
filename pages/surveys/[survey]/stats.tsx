import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "@/utils/authUtils";
import { Role } from "@prisma/client";
import Error from "next/error";
import SurveyStatsComponent from "@/components/surveyStats/surveyStatsComponent";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { fetcher } from "@/utils/swrConfig";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;
  const { user } = useUserData();

  const { data, isLoading, error, isValidating } = useSWR<ISurvey>(
    user && id ? `/api/surveys/${id}` : undefined,
    fetcher
  );

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  if (isLoading || isValidating || !data?.survey) return <Loading />;

  if (error)
    return (
      <Error statusCode={error === "Not Found" ? 404 : 500} title={error} />
    );

  return <SurveyStatsComponent survey={data.survey} />;
}

export default function ResponseStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

