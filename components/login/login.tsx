import { Alert, Box, Button, TextField } from "@mui/material";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";
import { useConfig } from "../utilityComponents/conficContext";

export function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleMailInput(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordInput(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSignin(e: FormEvent<HTMLFormElement>) {
    setError("");
    e.preventDefault();

    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        setError("E-Mail oder Passwort ungültig.");
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setError("E-Mail oder Passwort falsch");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(
        "Da ist etwas schiefgelaufen. Bitte noch einmal versuchen, ggf. Administrator informieren."
      );
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSignin}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label={"E-Mail"}
          value={email}
          onChange={handleMailInput}
          type="text "
        />
        <TextField
          label={"Passwort"}
          value={password}
          onChange={handlePasswordInput}
          type="password"
        />
        {process.env.NEXT_PUBLIC_MANUAL_INVITATION !== "true" && <Link href={"/requestPassword"}>Passwort vergessen? Hier klicken.</Link>}
        <Button type="submit">Anmelden</Button>
      </Box>
    </form>
  );
}
