import EditDataField from "@/components/masterDataTypes/editDataField";
import masterDataTypes from "@/pages/masterDataTypes";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { Sledding } from "@mui/icons-material";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function MasterDataTypesComponent() {
  const { user } = useUserData();
  const { masterDataTypes, mutate } = useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Select
        sx={{ mb: "2rem" }}
        onChange={handleMdtChange}
        value={selectedMdt ? selectedMdt.name : ""}
      >
        {masterDataTypes?.map((mdt) => (
          <MenuItem value={mdt.name}>{mdt.name}</MenuItem>
        ))}
      </Select>

      {selectedMdt && (
        <Box>
          <Typography variant="h4">{selectedMdt.name}</Typography>
          {selectedMdt.dataFields.map((df) => (
            <EditDataField masterDataType={selectedMdt} dataField={df} />
          ))}
        </Box>
      )}

      <Typography variant="h6">Neues Datenfeld</Typography>
      <EditDataField masterDataType={selectedMdt} />
    </Box>
  );
}

