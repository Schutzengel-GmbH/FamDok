import { Box } from "@mui/material";
import MainAppBar from "@/components/appBar/mainAppBar";
import Head from "next/head";
import Footer from "@/components/footer/footer";

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Head>
        <title>Fachdokumentation Frühe Hilfen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainAppBar />
      <Box sx={{ mt: "1rem", ml: "1rem", mr: "2rem", mb: "50px" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

