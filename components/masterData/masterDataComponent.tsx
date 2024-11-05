import NavItem from "@/components/mainPage/navItem";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { IMasterDataType } from "@/pages/api/masterDataType";
import { Add } from "@mui/icons-material";
import { useMasterData, useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { apiDelete, apiPostJson } from "@/utils/fetchApiUtils";
import { Poll } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import MasterDataDialog from "@/components/masterData/masterDataDialog";

export default function MasterDataComponent() {
  const [filter, setFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useUserData();
  const { masterDataTypes, mutate } = useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();
  const { masterData } = useMasterData(selectedMdt);

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  const handleAddButton = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Select
        sx={{ mb: "2rem" }}
        onChange={handleMdtChange}
        value={selectedMdt ? selectedMdt.name : ""}
      >
        {masterDataTypes?.map((mdt) => (
          <MenuItem value={mdt.name}>{mdt.name}</MenuItem>
        ))}
      </Select>
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <SearchTextField
            sx={{ flexGrow: 1 }}
            label="Filter"
            filter={filter}
            onChange={setFilter}
          />
          {/* <NavItem
            title={user?.role === "USER" ? "Meine Familien" : "Statistik"}
            icon={<Poll />}
            url={"/familiesStats"}
            canAccess={user ? true : false}
          /> */}
        </Box>
        <Button disabled={!selectedMdt} onClick={handleAddButton}>
          <Add />
          {selectedMdt?.name}
        </Button>
      </Box>
      <MasterDataDialog
        // make sure dialog can only open if MDT is selected
        open={selectedMdt && dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        masterDataType={selectedMdt}
      />
    </>
  );
}
