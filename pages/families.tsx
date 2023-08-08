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

  return <FamiliesPageComponent families={families} onChange={mutate} />;
}

export default function MePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

