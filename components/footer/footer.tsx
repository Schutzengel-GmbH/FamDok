import { useFooterUris } from "@/utils/apiHooks";
import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const { pages } = useFooterUris();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        p: ".5rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "1rem",
        backgroundColor: "#d9d9d9",
        zIndex: "99",
      }}
    >
      {pages.map((page) => (
        <Link key={page.uri} href={`/pages/${page.uri}`}>
          {page.title}
        </Link>
      ))}
    </Box>
  );
}

