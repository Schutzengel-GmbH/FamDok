import { Box, Button, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import React from "react";
import { isValidEmail } from "../../utils/validationUtils";

export interface EditUserProps {
  user: User;
}

export default function EditUser({ user }: EditUserProps) {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);

  const emailValid = isValidEmail(email);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  async function handleSave() {
    const response = await fetch("/api/user/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    console.log(response);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" sx={{ m: "1rem" }}>
        Meine Daten bearbeiten
      </Typography>

      <TextField
        value={name}
        onChange={handleNameChange}
        label={"Name"}
        sx={{ m: "1rem" }}
      />

      <TextField
        value={email}
        onChange={handleEmailChange}
        label={"E-Mail"}
        sx={{ m: "1rem" }}
        error={!emailValid}
      />

      <Button onClick={handleSave} sx={{ m: "1rem" }} disabled={!emailValid}>
        Speichern
      </Button>
    </Box>
  );
}
