import Card from "@/components/utilityComponents/card";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { QueryStats } from "@mui/icons-material";
import { useRouter } from "next/router";

type DashboardSurveyCardProps = { survey: FullSurvey };

export default function DashboardSurveyCard({
  survey,
}: DashboardSurveyCardProps) {
  const { push } = useRouter();

  function navigate(path: string) {
    return () => push(path);
  }

  return (
    <Card
      title={survey.name}
      text={survey.description}
      actions={[
        {
          title: "Alle Antworten",
          icon: <QueryStats />,
          action: navigate(`/surveys/${survey.id}/stats`),
        },
        {
          title: "Dashboard",
          icon: <QueryStats />,
          action: navigate(`/surveys/${survey.id}/dashboard`),
        },
      ]}
    />
  );
}

