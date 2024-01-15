import { getFullResponseJson } from "@/components/surveyStats/getJson";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
import { Box, MenuItem } from "@mui/material";
import {
  GridCsvExportMenuItem,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridToolbarFilterButton,
  GridToolbarProps,
  GridToolbarQuickFilter,
  ToolbarPropsOverrides,
  gridDataRowIdsSelector,
  gridFilterActiveItemsSelector,
  gridFilteredSortedRowIdsSelector,
  gridRowSelectionStateSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { gridAdditionalRowGroupsSelector } from "@mui/x-data-grid/internals";
import useSWR from "swr";

const CustomGridToolbar = (props) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter />
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem
          options={{ delimiter: ";", fileName: props.fileName }}
        />
        {props.jsonExportFnc && <JsonExportMenuItem toolbarProps={props} />}
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;

const JsonExportMenuItem = (props: {
  toolbarProps: Partial<GridToolbarProps & ToolbarPropsOverrides>;
}) => {
  const apiRef = useGridApiContext();
  const { data, fileName, jsonExportFnc, selectedIds } = props.toolbarProps;
  const filteredIds = gridFilteredSortedRowIdsSelector(apiRef);

  const filteredAndSelectedData = data
    .filter((d) => (filteredIds ? filteredIds.includes(d.id) : true))
    .filter((d) =>
      selectedIds?.length > 0 ? selectedIds.includes(d.id) : true
    );

  return (
    <MenuItem
      onClick={() => {
        const jsonString = jsonExportFnc(filteredAndSelectedData);
        const blob = new Blob([jsonString], {
          type: "text/json",
        });
        exportBlob(blob, `${fileName}.json`);

        // Hide the export menu after the export
        //@ts-ignore it's there, source: trust me bro
        props.hideMenu?.();
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

