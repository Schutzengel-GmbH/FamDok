import FamiliesTabulator from "@/components/familiesStats/familiesTabulator";
import MasterDataTabulator from "@/components/masterDataStats/masterDataTabulator";
import ErrorPage from "@/components/utilityComponents/error";
import { useMasterDataTypeById } from "@/utils/apiHooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const router = useRouter();
  const { masterDataTypeId } = router.query;

  const { isLoading, error, masterDataType } = useMasterDataTypeById(
    masterDataTypeId as string
  );

  if (isLoading) return <CircularProgress />;

  if (error || !masterDataType) return <ErrorPage message={error} />;

  return <MasterDataTabulator masterDataType={masterDataType} />;
}

export default function FamiliesStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

