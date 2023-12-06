import ResponseCard from "@/components/myResponses/responseCard";
import ResponsesFilter, {
  ResponseFilter,
} from "@/components/myResponses/responsesFilter";
import ErrorPage from "@/components/utilityComponents/error";
import {
  FullAnswer,
  FullResponse,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { useMyResponses, useSurvey } from "@/utils/apiHooks";
import { Box, CircularProgress } from "@mui/material";
import { isSameDay, parse, parseISO } from "date-fns";
import { useState } from "react";

type MyResponsesPageProps = {
  id: string;
};

export default function MyResponsesPageComponent({ id }: MyResponsesPageProps) {
  const [answerFilter, setAnswerFilter] = useState<ResponseFilter>(undefined);
  const { error, isLoading, isValidating, mutate, responses } =
    useMyResponses(id);

  const { survey } = useSurvey(id);

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorPage message={error} />;

  return (
    <Box>
      <ResponsesFilter
        survey={survey}
        answerFilter={answerFilter}
        onChange={setAnswerFilter}
      />
      {responses
        ?.filter(filterByQuestionAnswer(answerFilter))
        .filter((r) =>
          answerFilter?.filterFamily
            ? r.familyId === answerFilter.familyId
            : true
        )
        .map((r) => (
          <ResponseCard response={r} key={r.id} />
        ))}
    </Box>
  );
}

function filterByQuestionAnswer(filter: ResponseFilter) {
  if (!filter || !filter.filter) return () => true;

  return (response: FullResponse) => {
    const answer = response.answers.find(
      (q) => q.questionId === filter.question?.id
    );

    switch (filter.question?.type) {
      case "Text":
        return answer?.answerText === filter.filter.answerText;
      case "Bool":
        return answer?.answerBool === filter.filter.answerBool;
      case "Int":
        return answer?.answerInt === filter.filter.answerInt;
      case "Num":
        return answer?.answerNum === filter.filter.answerNum;
      case "Date":
        return isSameDay(
          new Date(answer?.answerDate),
          new Date(filter.filter.answerDate)
        );
      case "Scale":
      case "Select":
        return areSameSelectAnswers(answer, filter.filter);
    }
  };
}

function areSameSelectAnswers(a: PartialAnswer, b: PartialAnswer) {
  if (a?.answerSelect == undefined || b?.answerSelect == undefined)
    return false;

  if (a.answerSelect.length !== b.answerSelect.length) return false;

  return a.answerSelect.reduce((prev, oa) => {
    return b.answerSelect.find((ob) => ob.id === oa.id) ? prev && true : false;
  }, true);
}

