import useToast from "@/components/notifications/notificationContext";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { IFooters } from "@/pages/api/footer";
import { useFooterPageContent, useFooterUris } from "@/utils/apiHooks";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { Title } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FooterPage } from "@prisma/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function EditPage() {
  const [page, setPage] = useState<Partial<FooterPage>>({
    title: "",
    uri: "",
    markdown: "",
  });
  const [navTouched, setNavTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  const { pages, mutate } = useFooterUris();

  useEffect(() => {
    setLoading(true);
    if (router.query.uri !== "new") {
      fetch(`/api/footer/${router.query.uri}`)
        .then((res) =>
          res.json().then((v) => {
            if (v.error)
              addToast({
                message: `Unerwarteter Fehler: ${v.error}`,
                severity: "error",
              });
            if (v.footerPage) setPage(v.footerPage);
            else
              addToast({
                message: "Keine Seite",
                severity: "error",
              });
          })
        )
        .catch((err) =>
          addToast({
            message: `Unerwarteter Fehler: ${err}`,
            severity: "error",
          })
        );
    }
    setLoading(false);
  }, []);

  function setTitle(e: ChangeEvent<HTMLInputElement>) {
    setPage({
      ...page,
      title: e.target.value,
      uri: navTouched ? page.uri : generateNav(e.target.value),
    });
  }

  function generateNav(str: string) {
    return str.toLowerCase().replaceAll(" ", "-");
  }

  function setUri(e: ChangeEvent<HTMLInputElement>) {
    setNavTouched(true);
    setPage({ ...page, uri: e.target.value.slice(7).replaceAll(" ", "-") });
  }

  function setMarkdown(e: ChangeEvent<HTMLInputElement>) {
    setPage({ ...page, markdown: e.target.value });
  }

  async function handleSave() {
    if (page.id) {
      handleUpdate();
      return;
    }
    const res = await apiPostJson<IFooters>("/api/footer", page);
    if (res instanceof FetchError || res.error) {
      addToast({
        message: "Ein unerwarteter Fehler ist aufgetreten",
        severity: "error",
      });
    } else {
      addToast({ message: "Seite hinzugefügt", severity: "success" });
      router.push("/footerPages");
      mutate();
    }
  }

  async function handleUpdate() {
    const res = await apiPostJson<IFooters>(`/api/footer/${page.uri}`, page);
    if (res instanceof FetchError || res.error) {
      addToast({
        message: "Ein unerwarteter Fehler ist aufgetreten",
        severity: "error",
      });
    } else {
      addToast({ message: "Änderungen gespeichert", severity: "success" });
      router.push("/footerPages");
      mutate();
    }
  }

  function uriUnique() {
    const i = pages.findIndex((p) => p.uri === page.uri);
    if (i < 0) {
      return true;
    } else return pages[i].uri === router.query.uri;
  }

  function titleEmpty() {
    return !page.title;
  }

  function uriEmpty() {
    return !page.uri;
  }

  function shouldDisable() {
    return !uriUnique() || uriEmpty() || titleEmpty();
  }

  if (loading) return <Loading />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        },
        gap: "2rem",
      }}
    >
      <Box
        sx={{
          flexBasis: "50%",
          flexGrow: 0,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Typography variant="h4">
          {router.query.uri === "new"
            ? "Neue Seite erstellen"
            : "Seite bearbeiten"}
        </Typography>
        <TextField
          label={"Seitentitel"}
          value={page.title}
          onChange={setTitle}
          error={titleEmpty()}
        />
        <TextField
          value={`/pages/${page.uri}`}
          onChange={setUri}
          error={!uriUnique() || uriEmpty()}
        />
        <TextField
          label={"Seiteninhalt"}
          multiline
          minRows={4}
          value={page.markdown}
          onChange={setMarkdown}
        />
        {shouldDisable() && (
          <Box>
            <Typography variant="h5" color="red">
              Fehler:
            </Typography>
            {uriEmpty() && (
              <Typography variant="body1" color="red">
                Link darf nicht leer sein.
              </Typography>
            )}
            {!uriUnique() && (
              <Typography variant="body1" color="red">
                Link muss einzigartig sein.
              </Typography>
            )}
            {titleEmpty() && (
              <Typography variant="body1" color="red">
                Bitte einen Seitentitel angeben.
              </Typography>
            )}
          </Box>
        )}
        <Button disabled={shouldDisable()} onClick={handleSave}>
          Speichern
        </Button>
        <Button onClick={() => router.push("/footerPages")}>Abbrechen</Button>
      </Box>
      <Box
        sx={{
          flexBasis: "50%",
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <Typography variant="h4">Vorschau:</Typography>
        <ReactMarkdown>{page.markdown}</ReactMarkdown>
      </Box>
    </Box>
  );
}

