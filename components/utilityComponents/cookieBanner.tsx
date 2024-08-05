import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useConfig } from "./conficContext";

export default function CookieBanner() {
  const [cookiesOK, setCookiesOK] = useState(false);

  useEffect(
    () => setCookiesOK(localStorage.getItem("cookiesOK") === "true"),
    [],
  );

  const { cookieOKMessage } = useConfig();

  function handleOK() {
    setCookiesOK(true);
    localStorage?.setItem("cookiesOK", "true");
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: "5rem",
        padding: "1rem",
        width: "90vw",
        display: cookiesOK ? "none" : "block",
      }}
      elevation={6}
    >
      <Typography>
        {cookieOKMessage ||
          "Diese Website benutzt Cookies. Es werden ausschließlich Session-Cookies verwendet, um Benutzer*innen zu authentifizieren."}
      </Typography>
      <Button onClick={handleOK}>OK</Button>
    </Paper>
  );
}
