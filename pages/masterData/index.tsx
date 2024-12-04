import MasterDataComponent from "@/components/masterData/masterDataComponent";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <MasterDataComponent />;
}

export default function MasterDataPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
