import SessionReact from "supertokens-auth-react/recipe/session";
import EditMe from "../components/editMe/editMe";

function ProtectedPage() {
  return <EditMe />;
}

export default function Me() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
