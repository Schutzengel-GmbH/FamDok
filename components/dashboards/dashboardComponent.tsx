import DashboardDownloadButtons from "@/components/dashboards/dashboardDownloadButtons";
import FiltersComponent from "@/components/surveyStats/filtersComponent";
import { IMasterData } from "@/pages/api/masterDataType/[masterDataType]/[masterData]";
import survey from "@/pages/api/surveys/[survey]";
import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import {
  IFilter,
  IFamilyFilter,
  IGeneralFilter,
  getWhereInput,
  getGeneralWhereInput,
  IMasterDataFilter,
  getMasterDataWhereInput,
} from "@/utils/filters";
import {
  answersPerOrgDashboardData,
  answersPerQuestionDashboardData,
  answersPerSubOrgDashboardData,
  answersPerUserDashboardData,
  dashboardPerOrgColumnDefinitions,
  dashboardPerQuestionColumnDefinitions,
  dashboardPerSubOrgColumnDefinitions,
  dashboardPerUserColumnDefinitions,
  dashboardMDCountColumnDefinitions,
  getWhereInputFromFamilyFilters,
  globalOptions,
  masterDataDashboardData,
} from "@/utils/tableUtils";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { startOfMonth, startOfYear } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";

interface DashboardProps {
  survey: FullSurvey;
}

type CountByOption =
  | "user"
  | "organization"
  | "subOrganization"
  | "question"
  | "masterDataCount";

export default function Dashboard({ survey }: DashboardProps) {
  const [countBy, setCountBy] = useState<CountByOption>("user");
  const [columnDef, setColumnDef] = useState<ColumnDefinition[]>(
    dashboardPerUserColumnDefinitions,
  );
  const [selectedQuestion, setSelectedQuestion] = useState<FullQuestion>();
  const tableRef = useRef();

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
  const [where, setWhere] = useState<Prisma.ResponseWhereInput>({
    AND: [
      ...filters.filters.map((f) => getWhereInput(f, survey)),
      ...filters.generalFilters.map(getGeneralWhereInput),
    ],
    family: survey.hasFamily
      ? getWhereInputFromFamilyFilters(filters.familyFilters)
      : undefined,
  });

  // useEffect(() => {
  //   setWhere({
  //     AND: [
  //       ...filters.filters.map((f) => getWhereInput(f, survey)),
  //       ...filters.generalFilters.map(getGeneralWhereInput),
  //     ],
  //     family: survey.hasFamily
  //       ? getWhereInputFromFamilyFilters(filters.familyFilters)
  //       : undefined,
  //   });
  // }, [filters]);

  function applyFilters() {
    if (!hasFilters) setWhere({});
    else
      setWhere({
        AND: [
          ...filters.filters.map((f) => getWhereInput(f, survey)),
          ...filters.generalFilters.map(getGeneralWhereInput),
        ],
        family: survey.hasFamily
          ? getWhereInputFromFamilyFilters(filters.familyFilters)
          : undefined,
        masterData: survey.hasMasterData
          ? {
              AND: [
                ...filters.masterDataFilters.map((f) =>
                  getMasterDataWhereInput(f, survey.masterDataType),
                ),
              ],
            }
          : undefined,
      });
  }

  const { responses, isLoading, error } = useResponses(survey.id, where);

  const data = useMemo(() => {
    switch (countBy) {
      case "user":
        setColumnDef(dashboardPerUserColumnDefinitions);
        return answersPerUserDashboardData(responses);
      case "organization":
        setColumnDef(dashboardPerOrgColumnDefinitions);
        return answersPerOrgDashboardData(responses);
      case "subOrganization":
        setColumnDef(dashboardPerSubOrgColumnDefinitions);
        return answersPerSubOrgDashboardData(responses);
      case "question":
        setColumnDef(dashboardPerQuestionColumnDefinitions);
        return answersPerQuestionDashboardData(responses, selectedQuestion);
      case "masterDataCount":
        setColumnDef(dashboardMDCountColumnDefinitions);
        return masterDataDashboardData(responses);
      default:
        return [];
    }
  }, [responses, countBy, selectedQuestion]);

  const hasFilters =
    filters.familyFilters?.length > 0 ||
    filters.filters?.length > 0 ||
    filters.generalFilters?.length > 0 ||
    filters.masterDataFilters?.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: ".5rem" }}>
        <CountBy
          countBy={countBy}
          onChange={setCountBy}
          hasMD={survey.hasMasterData}
        />
        {countBy === "question" && (
          <SelectQuestion
            survey={survey}
            question={selectedQuestion}
            onChange={setSelectedQuestion}
          />
        )}
        <FiltersComponent
          filters={filters.filters}
          familyFilters={filters.familyFilters}
          generalFilters={filters.generalFilters}
          masterDataFilters={filters.masterDataFilters}
          survey={survey}
          onChange={setFilters}
          onApply={applyFilters}
        />
      </Box>
      <DashboardDownloadButtons tableRef={tableRef} />
      {isLoading && <CircularProgress />}
      <ReactTabulator
        onRef={(ref) => (tableRef.current = ref.current)}
        columns={columnDef}
        data={data}
        style={{}}
        layout="fitData"
        options={{ ...globalOptions }}
      />
    </Box>
  );
}

function CountBy({
  countBy,
  hasMD,
  onChange,
}: {
  countBy: CountByOption;
  hasMD: boolean;
  onChange: (countBy: CountByOption) => void;
}) {
  return (
    <Select
      value={countBy}
      onChange={(e) => onChange(e.target.value as CountByOption)}
    >
      <MenuItem key={"user"} value={"user"}>
        Nach Benutzer*in
      </MenuItem>
      <MenuItem key={"organization"} value={"organization"}>
        Nach Organisation
      </MenuItem>
      <MenuItem key={"subOrganization"} value={"subOrganization"}>
        Nach Unterorganisation
      </MenuItem>
      <MenuItem key={"question"} value={"question"}>
        Nach Frage
      </MenuItem>
      {hasMD && (
        <MenuItem key={"masterDataCount"} value={"masterDataCount"}>
          Nach Stammdaten
        </MenuItem>
      )}
    </Select>
  );
}

function SelectQuestion({
  survey,
  question,
  onChange,
}: {
  survey: FullSurvey;
  question: FullQuestion;
  onChange: (question: FullQuestion) => void;
}) {
  function handleChange(e: SelectChangeEvent<string>) {
    onChange(survey.questions.find((q) => q.id === e.target.value));
  }

  return (
    <Select onChange={handleChange} value={question?.id || ""}>
      {survey.questions.map((q) => (
        <MenuItem key={q.id} value={q.id}>
          {q.questionText}
        </MenuItem>
      ))}
    </Select>
  );
}
