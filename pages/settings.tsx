import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "../utils/authUtils";
import Error from "next/error";
import { Role } from "@prisma/client";
import SettingsPageComponent from "@/components/adminDashboard/settingsPageComponent";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role !== Role.ADMIN)
    return <Error statusCode={403} title="Forbidden" />;

  return <SettingsPageComponent />;
}

export default function SettingsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
