import { IRequestPassword } from "@/pages/api/auth/request-password";
import { IResetPassword } from "@/pages/api/auth/reset-password";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { isValidEmail } from "@/utils/validationUtils";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function RequestPasswordComponent() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  useEffect(() => {
    setEmailValid(isValidEmail(email));
  }, [email]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await apiPostJson<IRequestPassword>(
      "/api/auth/request-password/",
      { email }
    );

    if (res instanceof FetchError) {
      setError(true);
      console.error(res);
    } else setDone(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        {done && (
          <Alert>
            Wenn die E-Mail-Adresse im System bekannt ist, wurde eine E-Mail zum
            Zurücksetzen des Passworts versendet.
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            Da ist etwas schiefgelaufen... Bitte versuchen Sie es später noch
            einmal. Ggf. Administrator informieren.
          </Alert>
        )}
        {!done && (
          <Typography>
            Hier die E-Mail-Adresse angeben, mit der sie sich anmelden. Wenn die
            Adresse bekannt ist, wird eine E-Mail mit weiteren Anweisungen
            verschickt.
          </Typography>
        )}
        <TextField
          label="E-Mail"
          value={email}
          onChange={handleChange}
          error={!emailValid}
          helperText={
            emailValid ? " " : "Bitte eine gültige E-Mail-Adresse eingeben"
          }
        />
        <Button disabled={done || !emailValid} type="submit">
          OK
        </Button>
      </Box>
    </form>
  );
}
