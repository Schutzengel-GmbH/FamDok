import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../../utils/swrConfig";
import { ISurvey } from "../../api/surveys/[survey]";
import ErrorPage from "../../../components/utilityComponents/error";
import Loading from "../../../components/utilityComponents/loadingMainContent";
import ResponseComponent from "../../../components/response/responseComponent";
import { useMasterDataByNumber } from "@/utils/apiHooks";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id, mdt: masterDataTypeId, number: number } = router.query;
  const { data, isLoading, error, mutate } = useSWR<ISurvey>(
    `/api/surveys/${id}`,
    fetcher,
  );
  const {
    masterData,
    isLoading: isLoadingMD,
    error: errorMD,
  } = useMasterDataByNumber(
    masterDataTypeId as string,
    parseInt(number as string),
  );

  if (isLoading || isLoadingMD) return <Loading />;

  if (error || data?.error || errorMD)
    return <ErrorPage message={error || data.error || errorMD} />;

  return (
    <ResponseComponent
      //@ts-ignore
      survey={data.survey}
      onChange={mutate}
      initialMasterData={masterData}
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
