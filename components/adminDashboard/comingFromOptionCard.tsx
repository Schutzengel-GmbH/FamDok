import { apiDelete } from "@/utils/fetchApiUtils";
import { Delete } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { ComingFromOption } from "@prisma/client";

type LocationCardProps = {
  comingFromOption: ComingFromOption;
  onChange: () => void;
};

export default function comingFromOptionCard({
  comingFromOption,
  onChange,
}: LocationCardProps) {
  async function del() {
    const res = await apiDelete(
      `/api/comingFromOptions/${comingFromOption.id}`
    );
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
      <Typography variant="h5">{comingFromOption.value}</Typography>
      <Button onClick={del}>
        <Delete /> Löschen
      </Button>
    </Paper>
  );
}

