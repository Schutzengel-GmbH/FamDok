import MasterDataByNumber from "@/components/masterData/masterDataByNumber";
import MasterDataComponent from "@/components/masterData/masterDataComponent";
import { useRouter } from "next/router";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const router = useRouter();
  const { masterDataTypeId, masterDataNumber } = router.query;

  return (
    <MasterDataByNumber
      masterDataNumber={masterDataNumber as string}
      masterDataTypeId={masterDataTypeId as string}
    />
  );
}

export default function MasterDataPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
