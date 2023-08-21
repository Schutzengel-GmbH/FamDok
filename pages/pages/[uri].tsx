import ErrorPage from "@/components/utilityComponents/error";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { useFooterPageContent } from "@/utils/apiHooks";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function Pages() {
  const router = useRouter();
  const { uri } = router.query;

  const { page, isLoading, error } = useFooterPageContent(uri as string);

  if (isLoading) return <Loading />;
  else if (error)
    if (error === "Not Found")
      return <ErrorPage message="Diese Seite konnte nicht gefunden werden" />;
    else return <ErrorPage message="Ein unerwarteter Fehler ist aufgetreten" />;
  else
    return (
      <Box>
        <ReactMarkdown>{page?.markdown}</ReactMarkdown>
      </Box>
    );
}

