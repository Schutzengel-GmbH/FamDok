import SessionReact from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  return <>Admin Dashboard</>;
}

export default function Me() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
