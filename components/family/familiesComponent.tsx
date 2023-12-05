import { FamilyCard } from "@/components/family/familyCard";
import FamilyDialog from "@/components/family/familyDialog";
import NavItem from "@/components/mainPage/navItem";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { FullFamily } from "@/types/prismaHelperTypes";
import { Poll } from "@mui/icons-material";
import { Box, Button, SxProps } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useFamily } from "@/utils/apiHooks";

export default function FamiliesComponen() {
  const [filter, setFilter] = useState("");
  const [newFamOpen, setNewFamOpen] = useState(false);

  const { families, isLoading, mutate } = useFamily(
    parseInt(filter) || undefined
  );

  function handleNew() {
    setNewFamOpen(true);
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <SearchTextField
            sx={{ flexGrow: 1 }}
            label="Filter: Familiennummer"
            filter={filter}
            onChange={setFilter}
          />
          <NavItem
            title={"Statistik"}
            icon={<Poll />}
            url={"/familiesStats"}
            canAccess={true}
          />
        </Box>
        <Button onClick={handleNew}>
          <Add />
          Neue Familie
        </Button>
        {families && families[0] && (
          <FamilyCard family={families[0]} onChange={mutate} />
        )}
      </Box>
      <FamilyDialog
        initialFamily={undefined}
        open={newFamOpen}
        onClose={() => {
          setNewFamOpen(false);
        }}
      />
    </>
  );
}

