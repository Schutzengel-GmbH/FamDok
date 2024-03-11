import { Role } from "@prisma/client";
import { useUserData } from "../utils/authUtils";
import Error from "next/error";
import SessionReact from "supertokens-auth-react/recipe/session";
import DashboardMainPage from "@/components/dashboards/dashboardsMain";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <DashboardMainPage />;
}

export default function DashboardsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
