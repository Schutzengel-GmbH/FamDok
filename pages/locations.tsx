import SessionReact from "supertokens-auth-react/recipe/session";
import { useUserData } from "@/utils/authUtils";
import Error from "next/error";
import { Role } from "@prisma/client";
import LocationsComponent from "@/components/adminDashboard/locationsComponent";

function ProtectedPage() {
  const { user } = useUserData();

  if (!user || user.role === Role.USER)
    return <Error statusCode={403} title="Forbidden" />;

  return <LocationsComponent />;
}

export default function LocationsPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

