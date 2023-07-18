import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;

  return <></>;
}

export default function MyResponsesPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
