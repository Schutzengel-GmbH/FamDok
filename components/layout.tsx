import { Box } from "@mui/material";
import MainAppBar from "@/components/appBar/mainAppBar";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Fachdokumentation Frühe Hilfen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainAppBar />
      <Box sx={{ mt: "1rem", ml: "1rem", mr: "2rem" }}>{children}</Box>
    </>
  );
}

