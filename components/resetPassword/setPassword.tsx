import { IResetPassword } from "@/pages/api/auth/reset-password";
import { apiPostJson } from "@/utils/fetchApiUtils";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type SetPasswordProps = {};

export default function SetPassword({}: SetPasswordProps) {
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    setError("");
    if (password !== passwordRep) setError("Passwörter stimmen nicht überein");
  }, [password, passwordRep]);

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleChangePasswordRep(e: ChangeEvent<HTMLInputElement>) {
    setPasswordRep(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setApiError("");

    const res = await apiPostJson<IResetPassword>(
      `/api/auth/reset-password?token=${token}`,
      {
        password,
      }
    );

    if (res.error) setApiError(res.error);
    else router.push("/auth");
  }

  return (
    <form onSubmit={handleSubmit}>
      {apiError && <Alert severity="error">{apiError}</Alert>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <TextField
          label="Neues Passwort"
          value={password}
          onChange={handleChangePassword}
        />
        <TextField
          label="Passwort wiederholen"
          value={passwordRep}
          onChange={handleChangePasswordRep}
        />
        <Button type="submit" disabled={error !== ""}>
          Bestätigen
        </Button>
      </Box>
    </form>
  );
}
