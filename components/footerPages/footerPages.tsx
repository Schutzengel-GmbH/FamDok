import FooterPageComponent from "@/components/footerPages/footerPageComponent";
import { useFooterUris } from "@/utils/apiHooks";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

export default function FooterPages() {
  const { pages } = useFooterUris();

  return (
    <Box>
      {pages.map((p) => (
        <FooterPageComponent page={p} />
      ))}
      <Button
        onClick={() => {}}
        startIcon={<Add />}
        variant="outlined"
        sx={{ marginTop: "1rem" }}
      >
        Neue Seite erstellen...
      </Button>
    </Box>
  );
}

