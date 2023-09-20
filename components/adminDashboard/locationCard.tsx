import { apiDelete } from "@/utils/fetchApiUtils";
import { Delete } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { PossibleLocation } from "@prisma/client";

type LocationCardProps = {
  location: PossibleLocation;
  onChange: () => void;
};

export default function LocationCard({
  location,
  onChange,
}: LocationCardProps) {
  async function del() {
    const res = await apiDelete(`/api/locations/${location.id}`);
    onChange();
  }

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: ".5rem",
        maxWidth: "500px",
      }}
      elevation={3}
    >
      <Typography variant="h5">{location.name}</Typography>
      <Button onClick={del}>
        <Delete /> Löschen
      </Button>
    </Paper>
  );
}

