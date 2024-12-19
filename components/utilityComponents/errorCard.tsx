import { Error } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";

export default function ErrorCard(props: { error: any }) {
  return (
    <Paper
      sx={{
        p: ".5rem",
        marginTop: "1rem",
        bgcolor: "rgb(255, 186, 186)",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
      }}
      elevation={3}
    >
      <Error color="error" />
      <Typography fontWeight={"bold"} color={"error"}>
        Fehler
      </Typography>
      <Typography>{props.error || "Unbekannter Fehler"}</Typography>
    </Paper>
  );
}

