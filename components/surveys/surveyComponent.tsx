import { Edit, QueryStats } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import SelectResponseDialog from "@/components/surveys/selectResponseDialog";
import useSWR from "swr";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { fetcher } from "@/utils/swrConfig";

export interface SurveyComponentProps {
  survey: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: {
          selectOptions: true;
          defaultAnswerSelectOptions: true;
        };
      };
    };
  }>;
}

export default function SurveyComponent({ survey }: SurveyComponentProps) {
  const [selectResponseOpen, setSelectResponseOpen] = useState<boolean>(false);

  const router = useRouter();

  const { data, isLoading, error } = useSWR<IResponses>(
    `/api/surveys/${survey.id}/responses/my`,
    fetcher
  );

  async function handleAddResponse() {
    router.push(`/surveys/${survey.id}/newResponse`);
  }

  function handleMyResponses() {
    setSelectResponseOpen(true);
  }

  return (
    <Paper sx={{ p: ".5rem", marginTop: "1rem" }} elevation={3}>
      <Typography variant="h5">{survey.name}</Typography>
      <Typography sx={{ marginBottom: "1rem" }}>
        {survey.description}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<Edit />}
        sx={{ marginRight: ".5rem" }}
        onClick={handleAddResponse}
      >
        Neue Antwort
      </Button>
      <Button
        variant="outlined"
        startIcon={<QueryStats />}
        sx={{ marginRight: ".5rem" }}
        onClick={handleMyResponses}
      >
        Meine Antworten
      </Button>

      <SelectResponseDialog
        responses={data?.responses || []}
        open={selectResponseOpen}
        onClose={() => setSelectResponseOpen(false)}
      />
    </Paper>
  );
}

