import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";

function ProtectedPage() {
  const router = useRouter();
  const { survey: surveyId, response: responseId } = router.query;

  return <></>;
}

export default function EditResponsePage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
