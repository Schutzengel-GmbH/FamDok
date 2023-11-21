import { FamilyCard } from "@/components/family/familyCard";
import FamilyDialog from "@/components/family/familyDialog";
import NavItem from "@/components/mainPage/navItem";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { FullFamily } from "@/types/prismaHelperTypes";
import { Add, Poll } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { Gender, Education, Disability } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";
import { useState } from "react";

type FamiliesPageProps = {
  families: FullFamily[];
  onChange: () => void;
};

export function FamiliesPageComponent({
  families,
  onChange,
}: FamiliesPageProps) {
  const [filter, setFilter] = useState("");
  const [newFamOpen, setNewFamOpen] = useState(false);

  function fncFilter(family: FullFamily) {
    if (!filter) return true;
    return filter.toLowerCase().includes(family.number.toString());
  }

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
        {families
          ?.filter(fncFilter)
          .sort((f1, f2) => f1.number - f2.number)
          .map((f) => (
            <FamilyCard key={f.id} family={f} onChange={onChange} />
          ))}
      </Box>
      <FamilyDialog
        initialFamily={undefined}
        open={newFamOpen}
        onClose={() => {
          setNewFamOpen(false);
          onChange();
        }}
      />
    </>
  );
}

