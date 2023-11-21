import FamilyStats from "@/components/familiesStats/familyStats";
import { FamiliesPageComponent } from "@/components/family/familiesPage";
import ErrorPage from "@/components/utilityComponents/error";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { useFamilies } from "@/utils/apiHooks";
import Error from "next/error";
import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const { families, isLoading, error, mutate } = useFamilies();

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  return <FamilyStats families={families} />;
}

export default function FamiliesStatsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

