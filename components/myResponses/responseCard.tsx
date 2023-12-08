import { FullResponse } from "@/types/prismaHelperTypes";
import { useSurvey } from "@/utils/apiHooks";
import { Box, Paper, SxProps, Typography } from "@mui/material";
import { useRouter } from "next/router";

type ResponseCardProps = {
  response: FullResponse;
  sx?: SxProps;
};

export default function ResponseCard({ response, sx }: ResponseCardProps) {
  const router = useRouter();

  function handleClick() {
    router.push(`/surveys/${response.surveyId}/${response.id}`);
  }

  return (
    <Box sx={sx} onClick={handleClick}>
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
        }}
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
    </Box>
  );
}

