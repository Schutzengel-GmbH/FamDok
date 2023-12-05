import { FamiliesPageComponent } from "@/components/family/familiesPage";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <FamiliesPageComponent />;
}

export default function MePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

