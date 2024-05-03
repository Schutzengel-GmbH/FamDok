import survey from "@/pages/api/surveys/[survey]";
import { Edit, QueryStats } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";

type CardAction = {
  title: string;
  icon?: ReactNode;
  action: () => void;
};

type CardProps = {
  title: string;
  text: string;
  actions: CardAction[];
};

export default function Card({ title, text, actions }: CardProps) {
  return (
    <Paper sx={{ p: ".5rem", marginTop: "1rem" }} elevation={3}>
      <Typography variant="h5">{title}</Typography>
      <Typography sx={{ marginBottom: "1rem" }}>{text}</Typography>
      {actions.map((a) => (
        <Button
          variant="outlined"
          startIcon={a.icon}
          sx={{ marginRight: ".5rem" }}
          onClick={a.action}
          key={a.title}
        >
          {a.title}
        </Button>
      ))}
    </Paper>
  );
}
