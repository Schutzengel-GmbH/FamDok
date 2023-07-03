import { Box } from "@mui/material";
import MainAppBar from "./appBar/mainAppBar";

export default function Layout({ children }) {
  return (
    <>
      <MainAppBar />
      <Box sx={{ m: "1rem" }}>{children}</Box>
    </>
  );
}
