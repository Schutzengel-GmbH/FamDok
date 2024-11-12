import MasterDataTypesComponent from "@/components/masterDataTypes/masterDataTypesComponent";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <MasterDataTypesComponent />;
}

export default function MasterDataTypesPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

