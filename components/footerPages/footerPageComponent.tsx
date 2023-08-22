import useToast from "@/components/notifications/notificationContext";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { useFooterUris } from "@/utils/apiHooks";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

type FooterPageComponentProps = {
  page: { uri: string; title: string };
  onChange: () => void;
};

export default function FooterPageComponent({
  page,
}: FooterPageComponentProps) {
  const router = useRouter();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { addToast } = useToast();
  const { mutate } = useFooterUris();

  async function doDelete() {
    const res = await fetch(`/api/footer/${page.uri}`, { method: "DELETE" });
    if (!res.ok) {
      addToast({
        message: "Ein unerwarteter Fehler ist aufgetreten",
        severity: "error",
      });
      setConfirmDeleteOpen(false);
    } else {
      addToast({ message: "Seite gelöscht", severity: "success" });
      mutate();
      setConfirmDeleteOpen(false);
    }
  }

  function handleDelete() {
    setConfirmDeleteOpen(true);
  }

  function handleEdit() {
    router.push(`/pages/edit/${page.uri}`);
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: ".5rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
    >
      <Typography variant="h5">{page.title}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: ".5rem",
        }}
      >
        <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
          Bearbeiten
        </Button>
        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={handleDelete}
        >
          Löschen
        </Button>
      </Box>

      <ConfirmDialog
        title={"Seite löschen?"}
        body={`Soll die Seite "${
          page.title || page.uri
        }" endgültig gelöscht werden?`}
        open={confirmDeleteOpen}
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </Paper>
  );
}

