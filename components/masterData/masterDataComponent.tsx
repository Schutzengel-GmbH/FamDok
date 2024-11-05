import SearchTextField from "@/components/utilityComponents/searchTextField";
import { Add } from "@mui/icons-material";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { addMasterData } from "@/utils/masterDataUtils";
import useToast from "@/components/notifications/notificationContext";
import { useRouter } from "next/router";

export default function MasterDataComponent() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();

  const { user } = useUserData();
  const { masterDataTypes, mutate } = useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
  };

  const { addToast } = useToast();

  const handleAddButton = async () => {
    let number = -1;
    try {
      const res = await addMasterData(selectedMdt, {
        masterDataType: { connect: { id: selectedMdt.id } },
        createdBy: { connect: { id: user.id } },
      });
      number = Number(res.number);
      router.push(`/masterData/${selectedMdt.id}/${number}`);
    } catch (e) {
      addToast({ message: `Fehler: ${e}`, severity: "error" });
    }
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
    </>
  );
}
