import MasterDataPage from "@/components/masterData/masterDataPage";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <MasterDataPage />;
}

export default function MePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}