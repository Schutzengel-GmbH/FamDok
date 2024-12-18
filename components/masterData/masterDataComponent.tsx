import SearchTextField from "@/components/utilityComponents/searchTextField";
import { Add, DeleteForever, QueryStats } from "@mui/icons-material";
import { useMasterData, useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { addMasterData } from "@/utils/masterDataUtils";
import useToast from "@/components/notifications/notificationContext";
import { useRouter } from "next/router";
import { FullMasterData } from "@/types/prismaHelperTypes";
import MasterDataCard from "@/components/masterData/masterDataCard";

export default function MasterDataComponent() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const { user } = useUserData();
  const { masterDataTypes } = useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();
  const { masterData } = useMasterData(selectedMdt?.id);
  const [displayedMasterData, setDisplayedMasterData] =
    useState<FullMasterData[]>(masterData);

  useEffect(() => {
    if (filter) {
      setDisplayedMasterData(
        masterData?.filter((md) => md.number === parseInt(filter)),
      );
    } else {
      setDisplayedMasterData(masterData);
    }
  }, [filter, masterData]);

  useEffect(
    () => setSelectedMdt(masterDataTypes ? masterDataTypes[0] : undefined),
    [masterDataTypes],
  );

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

  const navigateStats = () => {
    if (user.role === "USER")
      router.push(`/masterDataStats/${selectedMdt.id}/my`);
    router.push(`/masterDataStats/${selectedMdt.id}/`);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Select
          sx={{ mb: "2rem" }}
          onChange={handleMdtChange}
          value={selectedMdt ? selectedMdt.name : ""}
        >
          {masterDataTypes?.map((mdt) => (
            <MenuItem key={mdt.id} value={mdt.name}>
              {mdt.name}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={navigateStats}>
          <QueryStats />{" "}
          {user?.role === "USER" ? "Meine Familien" : "Statistik"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <SearchTextField
            sx={{ flexGrow: 1 }}
            label="Filter"
            filter={filter}
            onChange={setFilter}
          />
        </Box>
        <Button disabled={!selectedMdt} onClick={handleAddButton}>
          <Add />
          {selectedMdt?.name}
        </Button>
        {displayedMasterData?.map((m) => (
          <MasterDataCard key={m.number} masterData={m} />
        ))}
      </Box>
    </>
  );
}
