import { Box, Paper, Button, Typography } from "@mui/material";
import { Caregiver } from "@prisma/client";
import Add from "@mui/icons-material/Add";
import { useState } from "react";
import CaregiverComponent from "@/components/family/caregiverComponent";
import EditCaregiverDialog from "@/components/family/editCaregiverDialog";

interface CaregiverssComponentProps {
  value: Partial<Caregiver>[];
  onChange(caregivers: Partial<Caregiver>[]): void;
}

export default function CaregiversComponent({
  value,
  onChange,
}: CaregiverssComponentProps) {
  const [editOpen, setEditOpen] = useState<boolean>(false);

  function handleAdd() {
    setEditOpen(true);
  }

  function handleDelete(index?: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleChange(caregiver: Partial<Caregiver>, index: number) {
    onChange(value.map((c, i) => (i === index ? caregiver : c)));
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
        Bezugspersonen im Haushalt (Eltern):
      </Typography>
      <Paper sx={{ width: "100%" }}>
        {value.map((child, index) => (
          <CaregiverComponent
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

      <EditCaregiverDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(c) => onChange([...value, c])}
      />
    </Box>
  );
}
