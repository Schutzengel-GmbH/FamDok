import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import MyResponsesPageComponent from "@/components/myResponses/myResponsesPage";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { useUserData } from "@/utils/authUtils";
import { fetcher } from "@/utils/swrConfig";
import { Role } from "@prisma/client";
import useSWR from "swr";
import Error from "next/error";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;
  const { user } = useUserData();

  const { data, isLoading, error } = useSWR<ISurvey>(
    user && id ? `/api/surveys/${id}` : undefined,
    fetcher
  );

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  if (isLoading) return <Loading />;

  if (error || !data || !data.survey)
    return (
      <Error
        statusCode={error === "Not Found" ? 404 : 500}
        title={error || "Unbekannter Fehler"}
      />
    );

  return <MyResponsesPageComponent survey={data.survey} />;
}

export default function MyResponsesPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
