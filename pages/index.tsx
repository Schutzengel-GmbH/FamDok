import { Box, CircularProgress, Typography } from "@mui/material";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import useSWR from "swr";
import { fetcher } from "../utils/swrConfig";
import { IUserMe } from "./api/user/me";

function ProtectedPage() {
  const session = useSessionContext();

  const { data, isLoading } = useSWR("/api/user/me", fetcher<IUserMe>);

  if (session.loading === true || isLoading === true) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="body1">{data.user.email} logged in</Typography>
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
