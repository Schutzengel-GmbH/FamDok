import { Box, Button, Typography } from "@mui/material";
import { FooterPage } from "@prisma/client";
import React from "react";

type FooterPageComponentProps = {
  page: { uri: string; title: string };
};

export default function FooterPageComponent({
  page,
}: FooterPageComponentProps) {
  return (
    <Box>
      <Typography>{page.title}</Typography>
      <Button>Bearbeiten</Button>
      <Button>Löschen</Button>
    </Box>
  );
}

