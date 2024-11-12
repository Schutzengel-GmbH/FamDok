import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "../../../utils/authUtils";
import { useRouter } from "next/router";
import Loading from "../../../components/utilityComponents/loadingMainContent";
import ErrorPage from "../../../components/utilityComponents/error";
import { Role } from "@prisma/client";
import { useMasterDataTypeById } from "@/utils/apiHooks";
import EditMasterDataType from "@/components/masterDataTypes/editMasterDataType";

function ProtectedPage() {
  const router = useRouter();
  const { user } = useUserData();

  const { masterDataTypeId: id } = router.query;

  const { masterDataType, isLoading, mutate } = useMasterDataTypeById(
    id as string
  );

  if (isLoading) return <Loading />;

  if (!masterDataType) return <ErrorPage message="Unbekannter Fehler" />;

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.CONTROLLER &&
    user.role !== Role.ORGCONTROLLER &&
    user.organizationId === masterDataType.organizationId
  )
    return <ErrorPage message="Forbidden" />;

  return (
    <EditMasterDataType masterDataType={masterDataType} onChange={mutate} />
  );
}

export default function EditSurveyPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

