import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  function handleTogglePassword() {
    setShowPassword(!showPassword);
  }

  return (
    <form onSubmit={handleSignin}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label={"E-Mail"}
          value={email}
          onChange={handleMailInput}
          type="text"
          inputProps={{ inputMode: "email" }}
        />
        <TextField
          label={"Passwort"}
          value={password}
          onChange={handlePasswordInput}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  tabIndex={-1} //prevents tab navigation to access this button
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {process.env.NEXT_PUBLIC_MANUAL_INVITATION !== "true" && (
          <Link href={"/requestPassword"}>
            Passwort vergessen? Hier klicken.
          </Link>
        )}
        <Button type="submit">Anmelden</Button>
      </Box>
    </form>
  );
}
