import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "../../../utils/authUtils";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../../../components/utilityComponents/loadingMainContent";
import { ISurvey } from "../../api/surveys/[survey]";
import ErrorPage from "../../../components/utilityComponents/error";
import { Role } from "@prisma/client";
import { fetcher } from "../../../utils/swrConfig";
import EditSurveyComponent from "../../../components/editSurvey/editSurveyComponent";

function ProtectedPage() {
  const router = useRouter();
  const { user } = useUserData();

  const { survey: id } = router.query;

  const { data, isLoading, mutate } = useSWR<ISurvey>(
    `/api/surveys/${id}`,
    fetcher
  );

  if (isLoading) return <Loading />;

  if (!data?.survey) return <ErrorPage message="Unbekannter Fehler" />;

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.CONTROLLER &&
    user.role !== Role.ORGCONTROLLER &&
    user.organizationId === data.survey.organizationId
  )
    return <ErrorPage message="Forbidden" />;
  //@ts-ignore
  return <EditSurveyComponent survey={data.survey} onChange={mutate} />;
}

export default function EditSurveyPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

