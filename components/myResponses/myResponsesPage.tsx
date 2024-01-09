import { FilterType, ResponseFilter } from "@/components/myResponses/filter.t";
import { filterByQuestionAnswer } from "@/components/myResponses/logic";
import ResponseCard from "@/components/myResponses/responseCard";
import ResponseFilterComponent from "@/components/myResponses/responseFilterComponent";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";

import ErrorPage from "@/components/utilityComponents/error";
import { useMyResponses, useSurvey } from "@/utils/apiHooks";
import { apiDelete } from "@/utils/fetchApiUtils";
import { DeleteForever } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

type MyResponsesPageProps = {
  id: string;
};

export default function MyResponsesPageComponent({ id }: MyResponsesPageProps) {
  const { error, isLoading, isValidating, mutate, responses } =
    useMyResponses(id);
  const [responsesFilter, setResponsesFilter] =
    useState<ResponseFilter<FilterType>>(undefined);

  const { survey } = useSurvey(id);

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorPage message={error} />;

  function handleChangeFilter(f: ResponseFilter<FilterType>) {
    setResponsesFilter(f);
  }

  return (
    <Box>
      <ResponseFilterComponent
        filter={responsesFilter}
        onChange={handleChangeFilter}
        survey={survey}
      />
      {responses
        ?.filter(filterByQuestionAnswer(responsesFilter))
        .filter((r) =>
          responsesFilter?.filterFamily
            ? r.familyId === responsesFilter.familyId
            : true
        )
        .map((r) => (
          <ResponseCard response={r} key={r.id} onChange={mutate} />
        ))}
    </Box>
  );
}

