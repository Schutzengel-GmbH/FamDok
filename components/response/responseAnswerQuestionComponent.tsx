import { Box } from "@mui/material";
import {
  ChangedOrNewAnswer,
  FullAnswer,
  FullResponse,
  FullSurvey,
} from "../../types/prismaHelperTypes";
import { Prisma, Question } from "@prisma/client";

type ResponseAnswerQuestionComponentProps = {
  response?: FullResponse;
  survey: FullSurvey;
  onChange: (newAnswers: ChangedOrNewAnswer[]) => void;
};

export default function ResponseAnswerQuestionComponent({
  response,
  survey,
  onChange,
}: ResponseAnswerQuestionComponentProps) {
  console.log(survey);
  return (
    <Box>
      {survey.questions.map((q, i) => (
        <>{q.questionTitle}</>
      ))}
    </Box>
  );
}
