import { getFamiliesJson } from "@/components/surveyStats/getJson";
import { FullFamily } from "@/types/prismaHelperTypes";
import { exportBlob } from "@/utils/utils";
import { FileDownload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { MutableRefObject } from "react";

interface FamiliesStatsDownloadButtonProps {
  tableRef: MutableRefObject<any>;
  families: FullFamily[];
}

export default function FamiliesStatsDownloadButtons({
  tableRef,
  families,
}: FamiliesStatsDownloadButtonProps) {
  function downloadCSV() {
    tableRef.current.download(
      "csv",
      `Familien-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`,
      { delimiter: ";" }
    );
  }

  function downloadJSON() {
    const jsonString = getFamiliesJson(families);
    const blob = new Blob([jsonString], {
      type: "text/json",
    });
    exportBlob(blob, `Familien-${format(new Date(), "yyyy-MM-dd_hh-mm")}.json`);
  }

  function downloadXLSX() {
    tableRef.current.download(
      "xlsx",
      `Familien-${format(new Date(), "yyyy-MM-dd_hh-mm")}.xlsx`,
      { sheetName: `Familien` }
    );
  }

  return (
    <Box
      sx={{
        width: "20vw",
        ml: "1rem",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        gap: ".5rem",
      }}
    >
      <Button variant="outlined" onClick={downloadCSV}>
        <FileDownload />
        .CSV
      </Button>
      <Button variant="outlined" onClick={downloadJSON}>
        <FileDownload />
        .JSON
      </Button>
      <Button variant="outlined" onClick={downloadXLSX}>
        <FileDownload />
        .XLSX
      </Button>
    </Box>
  );
}

