import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useMyResponses, useResponses } from "@/utils/apiHooks";
import {
  getGeneralWhereInput,
  getMasterDataWhereInput,
  getWhereInput,
  IFamilyFilter,
  IFilter,
  IGeneralFilter,
  IMasterDataFilter,
} from "@/utils/filters";
import {
  allAnswersColumnDefinition,
  allResponsesColumnDefinition,
  familyColumnsDefinition,
  getWhereInputFromFamilyFilters,
  globalOptions,
  masterDataColumnDefinitions,
  responsesToAllAnswersTable,
} from "@/utils/tableUtils";
import { FilterAlt } from "@mui/icons-material";
import { Accordion, AccordionSummary, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadButtons from "@/components/utilityComponents/tabulatorDownloadButtons";
import { useRouter } from "next/router";

export default function ResponsesTabulator({
  survey,
  myResponses,
}: {
  survey: FullSurvey;
  myResponses: boolean;
}) {
  const [filters, setFilters] = useState<{
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
    generalFilters?: IGeneralFilter[];
    masterDataFilters?: IMasterDataFilter[];
  }>({
    filters: [],
    familyFilters: [],
    generalFilters: [
      {
        field: "responseCreatedAt",
        filter: "gte",
        value: startOfMonth(new Date()),
      },
    ],
    masterDataFilters: [],
  });
  const router = useRouter();
  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>({
    AND: [
      ...filters.filters.map((f) => getWhereInput(f, survey)),
      ...filters.generalFilters.map(getGeneralWhereInput),
    ],
    masterData: survey.hasMasterData
      ? {
          AND: [
            ...filters.masterDataFilters.map((f) =>
              getMasterDataWhereInput(f, survey.masterDataType),
            ),
          ],
        }
      : undefined,
    family: survey.hasFamily
      ? getWhereInputFromFamilyFilters(filters.familyFilters)
      : undefined,
  });

  function applyFilters() {
    if (!hasFilters) setWhereInput({});
    else
      setWhereInput({
        AND: [
          ...filters.filters.map((f) => getWhereInput(f, survey)),
          ...filters.generalFilters.map(getGeneralWhereInput),
        ],
        masterData: survey.hasMasterData
          ? {
              AND: [
                ...filters.masterDataFilters.map((f) =>
                  getMasterDataWhereInput(f, survey.masterDataType),
                ),
              ],
            }
          : undefined,
        family: survey.hasFamily
          ? getWhereInputFromFamilyFilters(filters.familyFilters)
          : undefined,
      });
  }

  const { responses, isLoading } = myResponses
    ? useMyResponses(survey.id, whereInput)
    : useResponses(survey.id, whereInput);

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
      ...allResponsesColumnDefinition(),
      ...familyColumnsDefinition(survey),
      ...masterDataColumnDefinitions(survey),
    ],
    [survey],
  );

  const data = useMemo(
    () => responsesToAllAnswersTable(responses),
    [responses, survey, filters],
  );

  const hasFilters =
    filters.familyFilters?.length > 0 ||
    filters.filters?.length > 0 ||
    filters.generalFilters?.length > 0 ||
    filters.masterDataFilters?.length > 0;

  function editClick(row) {
    const surveyId = row.surveyId;
    const responseId = row.id;

    router.push(`/surveys/${surveyId}/${responseId}`);
  }

  const options = {
    pagination: true,
    paginationSize: 12,
    paginationSizeSelector: true,
  };

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
            {filters.familyFilters?.length ||
            filters.filters?.length ||
            filters.generalFilters?.length ||
            filters.masterDataFilters?.length
              ? "Filter bearbeiten"
              : "Filter hinzufügen"}
          </AccordionSummary>

          <Box sx={{ p: ".5rem" }}>
            <FiltersComponent
              survey={survey}
              filters={filters.filters}
              familyFilters={filters.familyFilters}
              generalFilters={filters.generalFilters}
              masterDataFilters={filters.masterDataFilters}
              onChange={setFilters}
              onApply={applyFilters}
            />
          </Box>
        </Accordion>
        <DownloadButtons
          tableRef={tableRef}
          responses={responses}
          survey={survey}
        />
      </Box>
      {isLoading && <CircularProgress />}
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
