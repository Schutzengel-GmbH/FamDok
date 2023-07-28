import { Box } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const CustomGridToolbar = (fileName: string) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter />

      <GridToolbarExport
        printOptions={{ disableToolbarButton: true }}
        csvOptions={{ delimiter: ";", fileName: fileName }}
      />
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;
