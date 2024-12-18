import MasterDataTabulator from "@/components/masterDataStats/masterDataTabulator";
import MyMasterDataTabulator from "@/components/masterDataStats/myMasterDataTabulator";
import ErrorPage from "@/components/utilityComponents/error";
import { useMasterDataTypeById } from "@/utils/apiHooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const router = useRouter();
  const { masterDataTypeId } = router.query;

  const { isLoading, error, masterDataType } = useMasterDataTypeById(
    masterDataTypeId as string,
  );

  if (isLoading) return <CircularProgress />;

  if (error || !masterDataType) return <ErrorPage message={error} />;

  return <MyMasterDataTabulator masterDataType={masterDataType} />;
}

export default function MyMasterDataStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
