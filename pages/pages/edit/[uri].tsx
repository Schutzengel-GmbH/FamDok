import SessionReact from "supertokens-auth-react/recipe/session";
import EditFooterPage from "@/components/footerPages/editPage";

function ProtectedPage() {
  return <EditFooterPage />;
}

export default function MePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

