import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import { IFilter, IFamilyFilter } from "@/utils/filters";
import {
  getWhereInputFromFamilyFilters,
  allAnswersColumnDefinition,
  familyColumnsDefinition,
  responsesToAllAnswersTable,
  globalOptions,
} from "@/utils/tableUtils";
import { FilterAlt, FileDownload } from "@mui/icons-material";
import { Box, Accordion, AccordionSummary, Button } from "@mui/material";
import { Prisma } from "@prisma/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect, useRef, useMemo } from "react";
import { ReactTabulator } from "react-tabulator";

interface DashboardProps {
  survey: FullSurvey;
}

export default function Dashboard({ survey }: DashboardProps) {
  const [filters, setFilters] = useState<{
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
  }>({ filters: [], familyFilters: [] });
  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>();

  useEffect(() => {
    setWhereInput({
      AND: filters.filters.map(getWhereInput),
      family: { AND: getWhereInputFromFamilyFilters(filters.familyFilters) },
    });
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

  const columns = useMemo(
    () => [
      ...allAnswersColumnDefinition(survey),
      ...familyColumnsDefinition(survey),
    ],
    [survey]
  );

  const data = useMemo(
    () => responsesToAllAnswersTable(responses),
    [responses, survey, filters]
  );

  const options = {};

  function downloadCSV() {}

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Accordion sx={{ width: "75vw" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FilterAlt sx={{ mr: "1rem" }} />{" "}
            {filters.familyFilters?.length || filters.filters?.length
              ? "Filter bearbeiten"
              : "Filter hinzufügen"}
          </AccordionSummary>

          <Box sx={{ p: ".5rem" }}>
            <FiltersComponent
              survey={survey}
              filters={filters.filters}
              familyFilters={filters.familyFilters}
              onChange={setFilters}
            />
          </Box>
        </Accordion>

        <Box
          sx={{
            width: "20vw",
            ml: "1rem",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
          }}
        >
          <Button variant="outlined" onClick={downloadCSV}>
            <FileDownload />
            Download .CSV
          </Button>
        </Box>
      </Box>

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
