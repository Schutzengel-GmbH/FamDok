import { Box, Paper, Button, Typography } from "@mui/material";
import { Child } from "@prisma/client";
import ChildComponent from "./childComponent";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import EditChildDialog from "@/components/family/editChildDialog";

interface ChildrenComponentProps {
  value: Partial<Child>[];
  onChange(children: Partial<Child>[]): void;
}

export default function ChildrenComponent({
  value,
  onChange,
}: ChildrenComponentProps) {
  const [editOpen, setEditOpen] = useState<boolean>(false);

  function handleAdd() {
    setEditOpen(true);
  }

  function handleDelete(index?: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleChange(child: Partial<Child>, index: number) {
    onChange(value.map((c, i) => (i === index ? child : c)));
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="body2"
        sx={{ mt: ".25rem", fontSize: "medium", fontWeight: "bold" }}
      >
        Kinder:
      </Typography>
      <Paper sx={{ width: "100%" }}>
        {value.map((child, index) => (
          <ChildComponent
            key={index}
            value={child}
            onDelete={() => handleDelete(index)}
            onChange={(c) => handleChange(c, index)}
          />
        ))}
        <Paper
          sx={{
            mt: "1rem",
            m: ".2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            p: ".25rem",
          }}
        >
          <Button sx={{ width: "100%", height: "100%" }} onClick={handleAdd}>
            <Add />
          </Button>
        </Paper>
      </Paper>

      <EditChildDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(c) => onChange([...value, c])}
      />
    </Box>
  );
}
