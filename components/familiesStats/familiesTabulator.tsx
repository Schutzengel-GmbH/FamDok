import { useMyFamilies, useFamilies } from "@/utils/apiHooks";
import {
  applyFamilyFilter,
  familyColumnsDefinition,
  getFamilyData,
  getWhereInputFromFamilyFilters,
  globalOptions,
} from "@/utils/tableUtils";
import { FilterAlt, FileDownload, Add, Delete } from "@mui/icons-material";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IFamilyFilter } from "@/utils/filters";
import { format, startOfYear } from "date-fns";
import { useUserData } from "@/utils/authUtils";
import FamilyFilterComponent from "@/components/surveyStats/familyFilterComponent";
import { exportBlob } from "@/utils/utils";
import { getFamiliesJson } from "@/components/surveyStats/getJson";
import FamiliesStatsDownloadButtons from "@/components/familiesStats/familiesStatsDownloadButtons";
import { Prisma } from "@prisma/client";

export default function FamiliesTabulator() {
  const { user } = useUserData();
  const [familyFilters, setFamilyFilters] = useState<IFamilyFilter[]>([
    { filter: "gte", field: "beginOfCare", value: startOfYear(new Date()) },
  ]);
  const [where, setWhere] = useState<Prisma.FamilyWhereInput>(
    getWhereInputFromFamilyFilters(familyFilters)
  );
  const tableRef = useRef(null);

  const { families, isLoading } =
    user?.role === "USER" ? useMyFamilies(where) : useFamilies(where);

  const data = useMemo(() => families?.map(getFamilyData), [families]);
  const columns = useMemo(() => familyColumnsDefinition(), []);

  function addFamilyFilter() {
    setFamilyFilters([...familyFilters, undefined]);
  }

  function updateFamilyFilter(updatedFilter: IFamilyFilter, index: number) {
    setFamilyFilters(
      familyFilters.map((f, i) => (i === index ? updatedFilter : f))
    );
  }

  function deleteFamilyFilter(index: number) {
    setFamilyFilters(familyFilters.filter((_, i) => i !== index));
  }

  function applyFilters() {
    setWhere(getWhereInputFromFamilyFilters(familyFilters));
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
            {familyFilters?.length ? "Filter bearbeiten" : "Filter hinzufügen"}
          </AccordionSummary>

          <Box sx={{ p: ".5rem" }}>
            <Button onClick={addFamilyFilter}>
              <Add /> Familien-Filter
            </Button>
          </Box>
          {familyFilters.map((f, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                m: ".5rem",
              }}
            >
              <FamilyFilterComponent
                survey={undefined}
                key={i}
                familyFilter={f}
                onChange={(familyFilter) => updateFamilyFilter(familyFilter, i)}
              />
              <IconButton color="primary" onClick={() => deleteFamilyFilter(i)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button onClick={applyFilters}>Filter anwenden</Button>
        </Accordion>
        <FamiliesStatsDownloadButtons tableRef={tableRef} families={families} />
      </Box>

      {isLoading && <CircularProgress />}

      <ReactTabulator
        onRef={(ref) => (tableRef.current = ref.current)}
        columns={columns}
        data={data}
        style={{}}
        layout="fitData"
        options={{ ...globalOptions }}
      />
    </Box>
  );
}

