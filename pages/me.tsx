import { CircularProgress } from "@mui/material";
import SessionReact, {
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import EditMe from "../components/editMe/editMe";
import { useUserData } from "../utils/authUtils";

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
