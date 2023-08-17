import SetPassword from "@/components/resetPassword/setPassword";
import { Box, Typography } from "@mui/material";
import Error from "next/error";
import { useRouter } from "next/router";

export default function SetPasswordPage() {
  const router = useRouter();

  if (!router.query.token)
    return <Error statusCode={422} title="Kein Reset-Token" />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Typography>Bitte ein sicheres Passwort erstellen.</Typography>
      <SetPassword />
    </Box>
  );
}
