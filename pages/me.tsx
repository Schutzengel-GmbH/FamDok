import { Box, CircularProgress } from "@mui/material";
import useSWR from "swr";
import SessionReact, {
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import { fetcher } from "../utils/swrConfig";
import { IUserMe } from "./api/user/me";
import EditUser from "../components/editUser/editUser";

function ProtectedPage() {
  const session = useSessionContext();

  const { data, isLoading } = useSWR("/api/user/me", fetcher<IUserMe>);

  if (session.loading === true || isLoading === true) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ m: 1 }}>
      <EditUser user={data.user} />
    </Box>
  );
}

export default function Me() {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
