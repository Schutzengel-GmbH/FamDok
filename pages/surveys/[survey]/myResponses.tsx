import SessionReact from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import MyResponsesPageComponent from "@/components/myResponses/myResponsesPage";

function ProtectedPage() {
  const router = useRouter();
  const { survey: id } = router.query;

  return <MyResponsesPageComponent id={id as string} />;
}

export default function MyResponsesPage() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}

