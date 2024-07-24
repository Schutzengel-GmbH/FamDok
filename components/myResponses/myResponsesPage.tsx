import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useMyResponses } from "@/utils/apiHooks";
import { IFamilyFilter, IFilter, IGeneralFilter } from "@/utils/filters";
import {
  allAnswersColumnDefinition,
  familyColumnsDefinition,
  getWhereInputFromFamilyFilters,
  globalOptions,
  responsesToAllAnswersTable,
} from "@/utils/tableUtils";
import { FileDownload, FilterAlt } from "@mui/icons-material";
import { Accordion, AccordionSummary, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma } from "@prisma/client";
import { format, startOfYear } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { exportBlob } from "@/utils/utils";
import { getFullResponseJson } from "@/components/surveyStats/getJson";
import { useRouter } from "next/router";
import DownloadButtons from "@/components/utilityComponents/tabulatorDownloadButtons";

export default function MyResponsesTabulator({
  survey,
}: {
  survey: FullSurvey;
}) {
  const [filters, setFilters] = useState<{
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
    generalFilters?: IGeneralFilter[];
  }>({
    filters: [],
    familyFilters: [],
    generalFilters: [
      {
        field: "responseCreatedAt",
        filter: "gte",
        value: startOfYear(new Date()),
      },
    ],
  });

  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>({
    AND: [
      ...filters.filters.map(getWhereInput),
      ...filters.generalFilters.map(getGeneralWhereInput),
    ],
    family: survey.hasFamily
      ? getWhereInputFromFamilyFilters(filters.familyFilters)
      : undefined,
  });
  const router = useRouter();

  useEffect(() => {
    setWhereInput({
      AND: [
        ...filters.filters.map(getWhereInput),
        ...filters.generalFilters.map(getGeneralWhereInput),
      ],
      family: survey.hasFamily
        ? getWhereInputFromFamilyFilters(filters.familyFilters)
        : undefined,
    });
  }, [filters]);

  function getGeneralWhereInput(
    generalFilter: IGeneralFilter
  ): Prisma.ResponseWhereInput {
    if (!generalFilter?.field) return {};

    console.log(generalFilter);

    switch (generalFilter.field) {
      case "responseCreatedBy":
        return {
          user: {
            name: {
              [generalFilter.filter]: generalFilter.value,
              mode: "insensitive",
            },
          },
        };
      case "responseCreatedAt":
        return { createdAt: { [generalFilter.filter]: generalFilter.value } };
      default:
        return {};
    }
  }

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
      {
        title: "",
        headerSort: false,
        formatter: () => '<i class="fa-solid fa-pen-to-square" />',
        cellClick: (_e, cell) => editClick(cell.getRow().getData()),
      },
      ...allAnswersColumnDefinition(survey),
      ...familyColumnsDefinition(survey),
    ],
    [survey]
  );

  const data = useMemo(
    () => responsesToAllAnswersTable(responses),
    [responses, survey, filters]
  );

  console.log(responses);

  const options = {};

  function editClick(row) {
    const surveyId = row.surveyId;
    const responseId = row.id;

    router.push(`/surveys/${surveyId}/${responseId}`);
  }

  const hasFilters =
    filters.familyFilters?.length > 0 ||
    filters.filters?.length > 0 ||
    filters.generalFilters?.length > 0;

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
            <FilterAlt
              color={hasFilters ? "success" : "disabled"}
              sx={{ mr: "1rem" }}
            />{" "}
            {filters.familyFilters?.length || filters.filters?.length
              ? "Filter bearbeiten"
              : "Filter hinzufügen"}
          </AccordionSummary>

          <Box sx={{ p: ".5rem" }}>
            <FiltersComponent
              survey={survey}
              filters={filters.filters}
              familyFilters={filters.familyFilters}
              generalFilters={filters.generalFilters}
              onChange={setFilters}
            />
          </Box>
        </Accordion>

        <DownloadButtons
          tableRef={tableRef}
          responses={responses}
          survey={survey}
        />
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

