import { IResetPassword } from "@/pages/api/auth/reset-password";
import { apiPostJson } from "@/utils/fetchApiUtils";
import { PasswordValidation, passwordValidator } from "@/utils/validationUtils";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type SetPasswordProps = {};

export default function SetPassword({}: SetPasswordProps) {
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [matchErr, setMatchErr] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({ valid: false, rejectionReasons: ["SHORT"] });
  const [apiError, setApiError] = useState("");

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    setMatchErr(false);
    setPasswordValidation(passwordValidator(password));
    if (password !== passwordRep) setMatchErr(true);
  }, [password, passwordRep]);

  function invalidPasswordHint() {
    const { rejectionReasons } = passwordValidation;
    let string = "";
    if (rejectionReasons.includes("SHORT"))
      string = string.concat("Mindestens 8 Zeichen verwenden. ");
    if (rejectionReasons.includes("NO_UPPERCASE"))
      string = string.concat("Mindestens einen Großbuchstaben verwenden. ");
    if (rejectionReasons.includes("NO_LOWERCASE"))
      string = string.concat("Mindestens einen Kleinbuchstaben verwenden. ");
    if (rejectionReasons.includes("NO_NUMERIC"))
      string = string.concat("Mindestens eine Ziffer verwenden. ");

    return string;
  }

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
          type="password"
          value={password}
          onChange={handleChangePassword}
          helperText={!passwordValidation.valid ? invalidPasswordHint() : " "}
          error={matchErr || !passwordValidation.valid}
        />
        <TextField
          label="Passwort wiederholen"
          type="password"
          value={passwordRep}
          onChange={handleChangePasswordRep}
          helperText={matchErr ? "Passwörter stimmen nicht überein" : " "}
          error={matchErr || !passwordValidation.valid}
        />
        <Button type="submit" disabled={matchErr || !passwordValidation.valid}>
          Bestätigen
        </Button>
      </Box>
    </form>
  );
}
