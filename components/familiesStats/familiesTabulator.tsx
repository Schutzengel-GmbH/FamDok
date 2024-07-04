import { useMyFamilies, useFamilies } from "@/utils/apiHooks";
import {
  applyFamilyFilter,
  familyColumnsDefinition,
  getFamilyData,
  globalOptions,
} from "@/utils/tableUtils";
import { FilterAlt, FileDownload, Add, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IFamilyFilter } from "@/utils/filters";
import { format } from "date-fns";
import { useUserData } from "@/utils/authUtils";
import FamilyFilterComponent from "@/components/surveyStats/familyFilterComponent";

export default function FamiliesTabulator() {
  const { user } = useUserData();
  const { families } = user?.role === "USER" ? useMyFamilies() : useFamilies();
  const [familyFilters, setFamilyFilters] = useState<IFamilyFilter[]>([]);
  const tableRef = useRef(null);

  const data = useMemo(
    () => families?.map(getFamilyData).filter(applyFamilyFilters),
    [families, familyFilters]
  );
  const columns = useMemo(() => familyColumnsDefinition(), []);

  function downloadCSV() {
    tableRef.current.download(
      "csv",
      `Familien-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`,
      { delimiter: ";" }
    );
  }

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

  function applyFamilyFilters(row: any): boolean {
    if (!familyFilters || familyFilters.length === 0) return true;
    else
      for (const filter of familyFilters) {
        if (!filter) break;
        // apply each filter, if it passes, just keep going, if it fails, immediately exit the function and return false
        if (!applyFamilyFilter(filter, row[filter.field])) return false;
      }

    // when all filters have passed, return true
    return true;
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
        </Accordion>

        <Button
          variant="outlined"
          sx={{ width: "20vw", ml: "1rem", height: "fit-content" }}
          onClick={downloadCSV}
        >
          <FileDownload />
          Download .CSV
        </Button>
      </Box>

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
