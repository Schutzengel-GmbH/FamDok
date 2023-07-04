import { Box } from "@mui/material";
import MainAppBar from "./appBar/mainAppBar";

export default function Layout({ children }) {
  return (
    <>
      <MainAppBar />
      <Box sx={{ mt: "1rem", ml: "1rem", mr: "2rem" }}>{children}</Box>
    </>
  );
}
