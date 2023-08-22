import FooterPageComponent from "@/components/footerPages/footerPageComponent";
import { useFooterUris } from "@/utils/apiHooks";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export default function FooterPages() {
  const { pages, mutate } = useFooterUris();
  const router = useRouter();

  function handleNew() {
    router.push("/pages/edit/new");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {pages.map((p) => (
        <FooterPageComponent page={p} onChange={mutate} />
      ))}
      <Button
        onClick={handleNew}
        startIcon={<Add />}
        variant="outlined"
        sx={{ marginTop: "1rem" }}
      >
        Neue Seite erstellen...
      </Button>
    </Box>
  );
}

