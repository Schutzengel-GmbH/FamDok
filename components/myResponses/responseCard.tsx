import useToast from "@/components/notifications/notificationContext";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";
import { FullResponse } from "@/types/prismaHelperTypes";
import { useSurvey } from "@/utils/apiHooks";
import { FetchError, apiDelete } from "@/utils/fetchApiUtils";
import { DeleteForever } from "@mui/icons-material";
import { Box, Button, Paper, SxProps, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

type ResponseCardProps = {
  response: FullResponse;
  onChange: () => void;
  sx?: SxProps;
};

export default function ResponseCard({
  response,
  sx,
  onChange,
}: ResponseCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { addToast } = useToast();

  function handleClick() {
    router.push(`/surveys/${response.surveyId}/${response.id}`);
  }

  function handleDelete() {
    setOpen(true);
  }

  async function doDelete() {
    const res = await apiDelete<IResponse>(
      `/api/surveys/${response.surveyId}/responses/${response.id}`
    );
    if (!res.error && !(res instanceof FetchError))
      addToast({ message: "Antwort gelöscht", severity: "success" });
    else
      addToast({
        message: res.error || "Ein unbekannter Fehler ist aufgetreten",
        severity: "error",
      });
    onChange();
    setOpen(false);
  }

  return (
    <Box sx={{ ...sx, display: "flex" }}>
      <Paper
        elevation={3}
        sx={{
          m: "1rem",
          p: ".5rem",
          ":hover": {
            backgroundColor: "primary.light",
            cursor: "pointer",
            transition: "ease-in-out",
            transitionDuration: "200ms",
          },
          flexGrow: "9",
        }}
        onClick={handleClick}
      >
        {response.name && <Typography variant="h5">{response.name}</Typography>}
        {response.family && (
          <Typography>{`Zu Familie ${response.family.number}`}</Typography>
        )}
        <Typography>
          Erstellt am: {new Date(response.createdAt).toLocaleDateString()}
        </Typography>
        <Typography>
          Zuletzt geändert am:{" "}
          {new Date(response.updatedAt).toLocaleDateString()}
        </Typography>
      </Paper>
      <Button
        variant="outlined"
        sx={{ m: "1rem", flexGrow: "1" }}
        color="error"
        onClick={handleDelete}
      >
        <DeleteForever /> Löschen
      </Button>

      <ConfirmDialog
        title={"Antwort Löschen?"}
        body={"Soll diese Antwort endgültig gelöscht werden?"}
        open={open}
        onConfirm={doDelete}
        onCancel={() => setOpen(false)}
      />
    </Box>
  );
}

