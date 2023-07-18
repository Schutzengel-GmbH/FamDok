import { Edit } from "@mui/icons-material";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { Child } from "@prisma/client";
import { Delete } from "@mui/icons-material";
import EditChildDialog from "./editChildDialog";
import { useState } from "react";
import ChildDisplayBar from "./childDisplayBarComponent";

interface ChildrenComponentProps {
  value: Partial<Child>;
  onDelete(child: Partial<Child>): void;
  onChange(child: Partial<Child>): void;
}

export default function ChildrenComponent({
  value: child,
  onDelete,
  onChange,
}: ChildrenComponentProps) {
  const [open, setOpen] = useState<boolean>(false);

  function handleDelete() {
    onDelete(child);
  }

  function handleEdit() {
    setOpen(true);
  }

  function handleSave(c: Partial<Child>) {
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
        <ChildDisplayBar child={child} />
        <Box>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>

          <IconButton onClick={handleEdit}>
            <Edit />
          </IconButton>
        </Box>
      </Box>

      <EditChildDialog
        initialChild={child}
        onSave={handleSave}
        onClose={handleCancel}
        open={open}
      />
    </Paper>
  );
}
