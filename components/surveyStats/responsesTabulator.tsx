import { FamilyFields } from "@/components/surveyStats/familyFilterComponent";
import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import { IFamilyFilter, IFilter } from "@/utils/filters";
import {
  allAnswersColumnDefinition,
  familyColumnsDefinition,
  globalOptions,
  responsesToAllAnswersTable,
} from "@/utils/tableUtils";
import { FilterAlt } from "@mui/icons-material";
import { Accordion, AccordionSummary } from "@mui/material";
import { Box } from "@mui/system";
import { Prisma } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ResponsesTabulator({ survey }: { survey: FullSurvey }) {
  const [filters, setFilters] = useState<{
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
  }>({ filters: [], familyFilters: [] });
  const [whereInput, setWhereInput] = useState<Prisma.ResponseWhereInput>();

  useEffect(() => {
    setWhereInput({
      AND: filters.filters.map(getWhereInput),
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

  function applyFamilyFilter(row: any): boolean {
    if (!filters.familyFilters || filters.familyFilters.length === 0)
      return true;
    else
      for (const filter of filters.familyFilters) {
        if (!filter) break;
        // apply each filter, if it passes, just keep going, if it fails, immediately exit the function and return false
        if (!applyFilter(filter, row[filter.field])) return false;
      }

    // when all filters have passed, return true
    return true;
  }

  const data = useMemo(
    () => responsesToAllAnswersTable(responses).filter(applyFamilyFilter),
    [responses, survey, filters]
  );

  console.log(data);

  const options = {};

  function downloadCSV() {
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
      <Accordion sx={{ width: "90vw" }}>
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

function applyFilter(filter: IFamilyFilter, value: any): boolean {
  switch (filter.filter) {
    case "equals":
      switch (filter.field as FamilyFields) {
        // number
        case "familyNumber":
        case "childrenInHousehold":
          return value === filter.value;
        // Date
        case "beginOfCare":
        case "endOfCare":
          return isSameDay(new Date(filter.value), new Date(value));
        // string
        case "location":
        case "otherInstalledProfessionals":
        case "highestEducation":
        case "comingFrom":
          return filter.value.toLowerCase() === value?.toLowerCase();
        // boolean
        case "childrenWithDisability":
        case "careGiverWithDisability":
        case "childWithPsychDiagnosis":
        case "caregiverWithPsychDiagnosis":
        case "migrationBackground":
          if (filter.filter === "equals") return value === true;
          else return value !== true;
        default:
          return value === filter.value;
      }
    case "not":
      if (filter.field === "beginOfCare" || filter.field === "endOfCare")
        return !isSameDay(new Date(value), new Date(filter.value));
      return value !== filter.value;
    case "lt":
      return value < filter.value;
    case "lte":
      return value <= filter.value;
    case "gt":
      return value > filter.value;
    case "gte":
      return value >= filter.value;
    case "startsWith":
      return ((value as string) || "").startsWith(filter.value);
    case "endsWith":
      return ((value as string) || "").endsWith(filter.value);
    case "contains":
      return ((value as string) || "")
        .toLowerCase()
        .includes(filter.value?.toLowerCase());
    default:
      return true;
  }
}
