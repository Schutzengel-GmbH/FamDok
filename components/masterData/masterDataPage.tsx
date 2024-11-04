import { FamilyCard } from "@/components/family/familyCard";
import FamilyDialog from "@/components/family/familyDialog";
import NavItem from "@/components/mainPage/navItem";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { IMasterDataType } from "@/pages/api/masterDataType";
import { Add } from "@mui/icons-material";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { apiDelete, apiPostJson } from "@/utils/fetchApiUtils";
import { Poll } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { MasterDataType, Prisma } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export default function MasterDataPage() {
  const [name, setName] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const { user } = useUserData();
  const { masterDataTypes, mutate } = useMasterDataTypes();
  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleSave = async () => {
    const res = await apiPostJson<
      IMasterDataType,
      Prisma.MasterDataTypeCreateInput
    >("/api/masterDataType", { name });

    if (res.error) alert(res.error);

    mutate();
    setName("");
  };

  const handleDelete = async (id: string) => {
    const res = await apiDelete<IMasterDataType>(`api/masterDataType/${id}`);

    if (res.error) alert(res.error);
    mutate();
  };

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
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
            label="Filter: Familiennummer"
            filter={filter}
            onChange={setFilter}
          />
          <NavItem
            title={user?.role === "USER" ? "Meine Familien" : "Statistik"}
            icon={<Poll />}
            url={"/familiesStats"}
            canAccess={user ? true : false}
          />
        </Box>
        <Button>
          <Add />
          Neue Familie
        </Button>
      </Box>
    </>
  );
}
