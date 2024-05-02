import { useFooterUris } from "@/utils/apiHooks";
import { Paper } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const { pages } = useFooterUris();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        p: ".5rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "1rem",
        zIndex: "99",
      }}
      elevation={6}
    >
      {pages.map((page) => (
        <Link key={page.uri} href={`/pages/${page.uri}`}>
          {page.title}
        </Link>
      ))}
    </Paper>
  );
}
