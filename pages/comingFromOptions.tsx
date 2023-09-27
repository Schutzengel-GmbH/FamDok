import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "@/utils/authUtils";
import Error from "next/error";
import { Role } from "@prisma/client";
import ComingFromOptionsComponent from "@/components/adminDashboard/comingFromOptionsComponent";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <ComingFromOptionsComponent />;
}

export default function ComingFromOptionsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

