import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { FullResponse, FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
import { Box, MenuItem } from "@mui/material";
import {
  GridCsvExportMenuItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarExportContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { MutableRefObject } from "react";
import useSWR from "swr";

const CustomGridToolbar = (fileName: string, survey: FullSurvey) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter />
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem
          options={{ delimiter: ";", fileName: fileName }}
        />
        <JsonExportMenuItem survey={survey} fileName={fileName} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;

const JsonExportMenuItem = (props) => {
  const apiRef = useGridApiContext();
  const { hideMenu, survey, fileName } = props;

  const { data, isLoading, mutate } = useSWR<IResponses>(
    `/api/surveys/${survey.id}/responses`,
    fetcher
  );

  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(data.responses);
        const blob = new Blob([jsonString], {
          type: "text/json",
        });
        exportBlob(blob, `${fileName}.json`);

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      JSON Exportieren
    </MenuItem>
  );
};

const getJson = (data: FullResponse[]) => {
  return JSON.stringify(data, null, 2);
};

const exportBlob = (blob, filename) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};

