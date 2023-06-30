import { Box, CircularProgress, Typography } from "@mui/material";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

function ProtectedPage() {
  const session = useSessionContext();

  if (session.loading === true) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="body1">logged in</Typography>
    </Box>
  );
}

export default function Home(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
