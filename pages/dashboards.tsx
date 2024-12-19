import { Role } from "@prisma/client";
import { useUserData } from "../utils/authUtils";
import Error from "next/error";
import SessionReact from "supertokens-auth-react/recipe/session";
import DashboardMainPage from "@/components/dashboards/dashboardsMain";
import { useSurveys } from "@/utils/apiHooks";
import { CircularProgress } from "@mui/material";

function ProtectedPage() {
  const { user } = useUserData();
  const { surveys, error, isLoading } = useSurveys();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  if (error) return <Error statusCode={500} title="Internal Server Error" />;
  if (isLoading) return <CircularProgress />;

  //@ts-ignore
  return <DashboardMainPage surveys={surveys} />;
}

export default function DashboardsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

