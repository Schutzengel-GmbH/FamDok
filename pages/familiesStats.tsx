import FamilyStats from "@/components/familiesStats/familyStats";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <FamilyStats />;
}

export default function FamiliesStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

