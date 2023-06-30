import { Box, CircularProgress, Typography } from "@mui/material";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const session = useSessionContext();

  if (session.loading === true) {
    return <CircularProgress />;
  }

  return <Box></Box>;
}

export default function Home(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
