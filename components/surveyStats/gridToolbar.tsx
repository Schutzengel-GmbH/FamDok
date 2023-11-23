import { getFullResponseJson } from "@/components/surveyStats/getJson";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
import { Box, MenuItem } from "@mui/material";
import {
  GridCsvExportMenuItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiContext,
} from "@mui/x-data-grid";
import useSWR from "swr";

const CustomGridToolbar = (
  fileName: string,
  data: object,
  jsonExportFnc?: (data: object) => string
) => {
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
        {jsonExportFnc && (
          <JsonExportMenuItem
            data={data}
            fileName={fileName}
            jsonExportFnc={jsonExportFnc}
          />
        )}
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;

type JsonExportMenuItemProps = any & {
  data: object;
  fileName: string;
  jsonExportFnc: (data: object) => string;
};

const JsonExportMenuItem = (props: JsonExportMenuItemProps) => {
  const apiRef = useGridApiContext();
  const { hideMenu, data, fileName, jsonExportFnc } = props;

  return (
    <MenuItem
      onClick={() => {
        const jsonString = jsonExportFnc(data);
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

