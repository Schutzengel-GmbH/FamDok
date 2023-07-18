import { Box } from "@mui/material";
import { Prisma } from "@prisma/client";
import SurveyComponent from "./surveyComponent";

type SurveysProps = {
  surveys: Prisma.SurveyGetPayload<{
    include: {
      questions: {
        include: {
          selectOptions: true;
          defaultAnswerSelectOptions: true;
        };
      };
    };
  }>[];
};

export default function Surveys({ surveys }: SurveysProps) {
  return (
    <Box>
      {surveys.map((s) => (
        <SurveyComponent survey={s} />
      ))}
    </Box>
  );
}
