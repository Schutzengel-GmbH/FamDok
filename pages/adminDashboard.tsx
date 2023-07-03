import SessionReact from "supertokens-auth-react/recipe/session";
import AdminDashboard from "../components/adminDashboard/adminDashboard";

function ProtectedPage() {
  return <AdminDashboard />;
}

export default function Me() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
