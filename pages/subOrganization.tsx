import SessionReact from "supertokens-auth-react/recipe/session";
import Error from "next/error";
import { useUserData } from "@/utils/authUtils";
import { Role } from "@prisma/client";
import SubOrganizationDashboard from "@/components/subOrganization/subOrganizationDashboard";
import AdminSubOrganizationsDashboard from "@/components/subOrganization/adminSubOrgDashboard";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  if (user.role === Role.ORGCONTROLLER)
    return <SubOrganizationDashboard organizationId={user.organizationId} />;
  else return <AdminSubOrganizationsDashboard />;
}

export default function SubOrganizationPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

