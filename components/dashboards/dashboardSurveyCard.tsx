import Card from "@/components/utilityComponents/card";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { QueryStats } from "@mui/icons-material";
import { useRouter } from "next/router";

type DashboardSurveyCardProps = { survey: FullSurvey };

export default function DashboardSurveyCard({
  survey,
}: DashboardSurveyCardProps) {
  const { push } = useRouter();

  function navigate() {
    return () => push(`/surveys/${survey.id}/stats`);
  }

  return (
    <Card
      title={survey.name}
      text={survey.description}
      actions={[
        {
          title: "Alle Antworten",
          icon: <QueryStats />,
          action: navigate(),
        },
      ]}
    />
  );
}

