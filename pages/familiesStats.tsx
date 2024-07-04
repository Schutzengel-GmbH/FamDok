import FamiliesTabulator from "@/components/familiesStats/familiesTabulator";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <FamiliesTabulator />;
}

export default function FamiliesStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
