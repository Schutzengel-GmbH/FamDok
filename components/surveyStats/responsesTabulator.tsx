import FilterComponent, {
  IFilter,
} from "@/components/surveyStats/filterComponent";
import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import {
  allAnswersColumnDefinition,
  globalOptions,
  responsesToAllAnswersTable,
} from "@/utils/tableUtils";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";

export default function ResponsesTabulator({ survey }: { survey: FullSurvey }) {
  const [filters, setFilters] = useState<IFilter[]>([]);
  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>();

  useEffect(() => {
    setWhereInput({ AND: filters.map(getWhereInput) });
  }, [filters]);

  function getWhereInput(filter: IFilter): Prisma.ResponseWhereInput {
    if (!filter?.questionId) return {};

    if (filter.value === null || filter.value === undefined) return {};

    const question = survey?.questions?.find(
      (q) => q.id === filter?.questionId
    );

    let answerField: string;

    switch (question?.type) {
      case "Text":
        answerField = "answerText";
        break;
      case "Bool":
        answerField = "answerBool";
        break;
      case "Int":
        answerField = "answerInt";
        break;
      case "Num":
        answerField = "answerNum";
        break;
      case "Select":
        answerField = "answerSelect";
        break;
      case "Date":
        answerField = "answerDate";
        break;
      case "Scale":
        answerField = "answerSelect";
        break;
    }

    if (answerField === "answerSelect")
      return {
        answers: {
          some: {
            questionId: question?.id,
            answerSelect: {
              some: {
                id: { [filter.filter]: filter.value.map((o) => o.id) },
              },
            },
          },
        },
      };
    else
      return {
        answers: {
          some: {
            questionId: question?.id || undefined,
            [answerField]: filter
              ? {
                  [filter.filter]: filter.value,
                  mode:
                    answerField === "answerText" ? "insensitive" : undefined,
                }
              : null,
          },
        },
      };
  }

  const { responses } = useResponses(survey.id, whereInput);

  const tableRef = useRef(null);

  const columns = useMemo(() => allAnswersColumnDefinition(survey), [survey]);
  const data = useMemo(
    () => responsesToAllAnswersTable(responses),
    [responses, survey]
  );

  const options = {};

  function downlaodCSV() {
    tableRef.current.download(
      "csv",
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
    >
      <Paper elevation={5} sx={{ width: "90vw", p: ".5rem" }}>
        <FiltersComponent
          survey={survey}
          filters={filters}
          onChange={setFilters}
        />
      </Paper>
      <ReactTabulator
        onRef={(ref) => (tableRef.current = ref.current)}
        columns={columns}
        data={data}
        style={{}}
        layout="fitData"
        options={{ ...globalOptions, ...options }}
      />
    </Box>
  );
}
