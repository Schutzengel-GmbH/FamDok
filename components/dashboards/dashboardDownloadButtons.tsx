import { FileDownload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { MutableRefObject } from "react";

interface DashboardDownloadButtonsProps {
  tableRef: MutableRefObject<any>;
}

export default function DashboardDownloadButtons({
  tableRef,
}: DashboardDownloadButtonsProps) {
  function downloadCSV() {
    tableRef.current.download(
      "csv",
      `data-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`,
      { delimiter: ";", bom: true }
    );
  }

  function downloadJSON() {
    tableRef.current.download(
      "json",
      `data-${format(new Date(), "yyyy-MM-dd_hh-mm")}.json`
    );
  }

  function downloadXLSX() {
    tableRef.current.download(
      "xlsx",
      `data-${format(new Date(), "yyyy-MM-dd_hh-mm")}.xlsx`
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

