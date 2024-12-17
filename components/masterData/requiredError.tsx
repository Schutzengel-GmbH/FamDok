import { Paper, Alert } from "@mui/material";

interface RequiredErrorProps {
  requiredFieldState: { dataFieldText: string }[];
}

export default function RequiredError({
  requiredFieldState,
}: RequiredErrorProps) {
  return (
    <Paper sx={{ p: ".5rem", gap: ".5rem" }} elevation={3}>
      <Alert severity="error">
        {`Die Angaben zu diesen Fragen sind nicht optional: ${requiredFieldState.reduce(
          (prev, s) => (prev ? `${prev}, ${s.dataFieldText}` : s.dataFieldText),
          ""
        )}`}
      </Alert>
    </Paper>
  );
}

