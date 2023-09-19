import SessionReact from "supertokens-auth-react/recipe/session";
import { LogsComponent } from "@/components/adminDashboard/logs";
import { useUserData } from "@/utils/authUtils";
import Error from "next/error";
import { Role } from "@prisma/client";
import UsersComponent from "@/components/adminDashboard/users";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <UsersComponent />;
}
export default function UsersPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

