import { Role } from "@prisma/client";
import { useUserData } from "../utils/authUtils";
import Error from "next/error";
import SessionReact from "supertokens-auth-react/recipe/session";
import SurveyDashboard from "../components/surveyDashboard/surveyDashboard";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <SurveyDashboard />;
}

export default function SurveyDashboardPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
