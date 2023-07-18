import { Delete, Edit } from "@mui/icons-material";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { Caregiver } from "@prisma/client";
import { useState } from "react";
import EditCaregiverDialog from "./editCaregiverDialog";
import CaregiverDisplayBar from "./caregiverDisplayBarComponent";

interface CaregiverComponentProps {
  value: Partial<Caregiver>;
  onDelete(caregiver: Partial<Caregiver>): void;
  onChange(caregiver: Partial<Caregiver>): void;
}

export default function CaregiverComponent({
  value: caregiver,
  onChange,
  onDelete,
}: CaregiverComponentProps) {
  const [open, setOpen] = useState<boolean>(false);

  function handleDelete() {
    onDelete(caregiver);
  }

  function handleEdit() {
    setOpen(true);
  }

  function handleSave(c: Partial<Caregiver>) {
    onChange(c);
    setOpen(false);
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <Paper sx={{ m: ".2rem" }}>
      <Box
        sx={{
          mt: "1rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          p: ".25rem",
        }}
      >
        <CaregiverDisplayBar caregiver={caregiver} />
        <Box>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>

          <IconButton onClick={handleEdit}>
            <Edit />
          </IconButton>
        </Box>
      </Box>

      <EditCaregiverDialog
        initialCaregiver={caregiver}
        onSave={handleSave}
        onClose={handleCancel}
        open={open}
      />
    </Paper>
  );
}
