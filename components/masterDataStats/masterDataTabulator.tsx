import FamiliesStatsDownloadButtons from "@/components/familiesStats/familiesStatsDownloadButtons";
import FamilyFilterComponent from "@/components/surveyStats/familyFilterComponent";
import ErrorPage from "@/components/utilityComponents/error";
import {
  FilterAlt,
  FileDownload,
  Add,
  Delete,
  ExpandMore,
} from "@mui/icons-material";
import { FullMasterDataType } from "@/types/prismaHelperTypes";
import { useMasterData } from "@/utils/apiHooks";
import { getMasterDataWhereInput, IMasterDataFilter } from "@/utils/filters";
import {
  getMasterDataData,
  globalOptions,
  masterDataColumnDefinitionsNoSurvey,
} from "@/utils/tableUtils";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import MasterDataFilterComponent from "@/components/surveyStats/masterDataFilterComponent";
import MasterDataStatsDownloadButtons from "@/components/masterDataStats/masterDataStatsDownloadButtons";
import { useRouter } from "next/router";

interface MasterDataTabulatorProps {
  masterDataType: FullMasterDataType;
}

export default function MasterDataTabulator({
  masterDataType,
}: MasterDataTabulatorProps) {
  const [filters, setFilters] = useState<IMasterDataFilter[]>([]);
  const [where, setWhere] = useState({
    AND: [...filters?.map((f) => getMasterDataWhereInput(f, masterDataType))],
  });
  const router = useRouter();
  const { masterData, isLoading, error } = useMasterData(
    masterDataType.id,
    where
  );
  const tableRef = useRef(null);
  const data = useMemo(() => masterData?.map(getMasterDataData), [masterData]);
  const columns = useMemo(
    () => masterDataColumnDefinitionsNoSurvey(masterDataType),
    []
  );

  const hasFilters = filters?.length > 0;

  const addFilter = () => {
    setFilters([...filters, undefined]);
  };
  const updateFilters = (filter: IMasterDataFilter, index: number) => {
    setFilters(filters.map((f, i) => (i === index ? filter : f)));
  };
  const deleteFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };
  const applyFilters = () => {
    setWhere({
      AND: [...filters.map((f) => getMasterDataWhereInput(f, masterDataType))],
    });
  };

  if (isLoading) return <CircularProgress />;
  if (error || !masterData) return <ErrorPage message={error} />;

  const options = {
    pagination: true,
    paginationSize: 12,
    paginationSizeSelector: true,
  };

  const rowClick = (_: any, row: any) => {
    const number: number = row.getData().number;
    router.push(`/masterData/${masterDataType.id}/${number}`);
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
          <AccordionSummary expandIcon={<ExpandMore />}>
            <FilterAlt
              color={hasFilters ? "success" : "disabled"}
              sx={{ mr: "1rem" }}
            />{" "}
            {filters?.length ? "Filter bearbeiten" : "Filter hinzufügen"}
          </AccordionSummary>

          <Box sx={{ p: ".5rem" }}>
            <Button onClick={addFilter}>
              <Add /> Filter
            </Button>
          </Box>
          {filters.map((f, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                m: ".5rem",
              }}
            >
              <MasterDataFilterComponent
                masterDataType={masterDataType}
                key={i}
                onChange={(filter) => updateFilters(filter, i)}
                masterDataFilter={f}
              />
              <IconButton color="primary" onClick={() => deleteFilter(i)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button onClick={applyFilters}>Filter anwenden</Button>
        </Accordion>
        <MasterDataStatsDownloadButtons
          tableRef={tableRef}
          masterData={masterData}
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
        events={{ rowClick }}
      />
    </Box>
  );
}
