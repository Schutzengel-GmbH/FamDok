import useInfoDialog from "@/components/infoDialog/infoDialogContext";
import { getFullResponseJson } from "@/components/surveyStats/getJson";
import { FullResponse, FullSurvey } from "@/types/prismaHelperTypes";
import { exportBlob } from "@/utils/utils";
import { FileDownload } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { MutableRefObject } from "react";

interface DownloadButtonsProps {
  tableRef: MutableRefObject<any>;
  responses: FullResponse[];
  survey: FullSurvey;
}

export default function DownloadButtons({
  tableRef,
  responses,
  survey,
}: DownloadButtonsProps) {
  const { showInfoDialog } = useInfoDialog();

  function downloadCSV() {
    const hasSelect = survey.questions.find((q) => q.type === "Select");

    if (hasSelect)
      showInfoDialog({
        title: "Achtung",
        body: "Die Umfrage enthält mindestens eine Auswahl-Frage und die Tabelle daher Gruppen-Header, die in einer CSV-Datei nicht sauber wiedergegeben werden können.",
      });

    tableRef.current.download(
      "csv",
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`,
      { delimiter: ";", bom: true }
    );
  }

  function downloadJSON() {
    const jsonString = getFullResponseJson(responses);
    const blob = new Blob([jsonString], {
      type: "text/json",
    });
    exportBlob(
      blob,
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.json`
    );
  }

  function downloadXLSX() {
    tableRef.current.download(
      "xlsx",
      `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.xlsx`,
      { sheetName: `${survey.name}` }
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

