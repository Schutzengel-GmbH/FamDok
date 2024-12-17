import { getMasterDataJson } from "@/components/surveyStats/getJson";
import { FullFamily, FullMasterData } from "@/types/prismaHelperTypes";
import { exportBlob } from "@/utils/utils";
import { FileDownload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { MutableRefObject } from "react";

interface MasterDataStatsDownloadButtonProps {
  tableRef: MutableRefObject<any>;
  masterData: FullMasterData[];
}

export default function MasterDataStatsDownloadButtons({
  tableRef,
  masterData,
}: MasterDataStatsDownloadButtonProps) {
  const filename = `${masterData[0]?.masterDataTypeName}-${format(
    new Date(),
    "yyyy-MM-dd_hh-mm"
  )}`;

  function downloadCSV() {
    tableRef.current.download("csv", `${filename}.csv`, { delimiter: ";" });
  }

  function downloadJSON() {
    const jsonString = getMasterDataJson(masterData);
    const blob = new Blob([jsonString], {
      type: "text/json",
    });
    exportBlob(blob, `${filename}.json`);
  }

  function downloadXLSX() {
    tableRef.current.download("xlsx", `${filename}.xlsx`, {
      sheetName: `${masterData[0]?.masterDataTypeName}`,
    });
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

