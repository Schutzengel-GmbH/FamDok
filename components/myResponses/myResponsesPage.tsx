import { FamilyFields } from "@/components/surveyStats/familyFilterComponent";
import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullResponse, FullSurvey } from "@/types/prismaHelperTypes";
import { useMyResponses, useResponses } from "@/utils/apiHooks";
import { IFamilyFilter, IFilter } from "@/utils/filters";
import {
  allAnswersColumnDefinition,
  applyFamilyFilter,
  familyColumnsDefinition,
  getWhereInputFromFamilyFilters,
  globalOptions,
  responsesToAllAnswersTable,
} from "@/utils/tableUtils";
import { FileDownload, FilterAlt } from "@mui/icons-material";
import { Accordion, AccordionSummary, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { exportBlob } from "@/utils/utils";
import { getFullResponseJson } from "@/components/surveyStats/getJson";
import { useRouter } from "next/router";

export default function MyResponsesTabulator({
  survey,
}: {
  survey: FullSurvey;
}) {
  const [filters, setFilters] = useState<{
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
  }>({ filters: [], familyFilters: [] });
  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>();
  const router = useRouter();

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

  const { responses } = useMyResponses(survey.id, whereInput);

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

  function downloadCSV() {
    tableRef.current.download(
      "csv",
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`,
      { delimiter: ";" }
    );
  }

  function downloadJSON() {
    const jsonString = getFullResponseJson(responses);
    const blob = new Blob([jsonString], {
      type: "text/json",
    });
    exportBlob(
      blob,
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.json`
    );
  }

  function rowClick(e, row) {
    const surveyId = row.getData().surveyId;
    const responseId = row.getData().id;

    router.push(`/surveys/${surveyId}/${responseId}`);
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
          <Button variant="outlined" onClick={downloadJSON}>
            <FileDownload />
            Download .JSON
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
        events={{ rowClick }}
      />
    </Box>
  );
}
