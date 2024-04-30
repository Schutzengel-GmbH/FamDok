import { StatsSelector } from "@/components/surveyStats/surveyStatsComponent";
import Card from "@/components/utilityComponents/card";
import { FullSurvey } from "@/types/prismaHelperTypes";
import {
  AccountCircle,
  HouseOutlined,
  QueryStats,
  QuestionMark,
} from "@mui/icons-material";
import { useRouter } from "next/router";

type DashboardSurveyCardProps = { survey: FullSurvey };

export default function DashboardSurveyCard({
  survey,
}: DashboardSurveyCardProps) {
  const { push } = useRouter();

  function navigate(selectedStats: StatsSelector) {
    return () =>
      push(
        `/surveys/${survey.id}/stats${
          selectedStats ? `?selectedStats=${selectedStats}` : ""
        }`
      );
  }

  return (
    <Card
      title={survey.name}
      text={survey.description}
      actions={[
        {
          title: "Alle Antworten",
          icon: <QueryStats />,
          action: navigate("ALL_ANSWERS"),
        },
        {
          title: "pro User",
          icon: <AccountCircle />,
          action: navigate("NUM_ANSWERS_USER"),
        },
        {
          title: "pro Unterorganisation",
          icon: <HouseOutlined />,
          action: navigate("NUM_ANSWERS_SUBORG"),
        },
        {
          title: "nach Antwort",
          icon: <QuestionMark />,
          action: navigate("RESPONSES_WHERE_ANSWER"),
        },
      ]}
    />
  );
}

