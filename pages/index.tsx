import { CircularProgress } from "@mui/material";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import HomeNav from "../components/mainPage/homeNav";

function ProtectedPage() {
  const session = useSessionContext();

  if (session.loading === true) {
    return <CircularProgress />;
  }

  return <HomeNav />;
}

export default function Home(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
