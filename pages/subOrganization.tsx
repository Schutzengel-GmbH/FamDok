import SessionReact from "supertokens-auth-react/recipe/session";
import Error from "next/error";
import { useUserData } from "@/utils/authUtils";
import { Role } from "@prisma/client";
import SubOrganizationDashboard from "@/components/subOrganization/subOrganizationDashboard";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <SubOrganizationDashboard />;
}

export default function SubOrganizationPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
