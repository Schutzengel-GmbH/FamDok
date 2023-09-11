import { FamilyCard } from "@/components/family/familyCard";
import FamilyDialog from "@/components/family/familyDialog";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { FullFamily } from "@/types/prismaHelperTypes";
import { Add } from "@mui/icons-material";
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
        <SearchTextField
          label="Filter: Familiennummer"
          filter={filter}
          onChange={setFilter}
        />
        <Button onClick={handleNew}>
          <Add />
          Neue Familie
        </Button>
        {families?.filter(fncFilter).map((f) => (
          <FamilyCard key={f.id} family={f} onChange={onChange} />
        ))}
      </Box>
      <FamilyDialog
        initialFamily={undefined}
        open={newFamOpen}
        onClose={() => setNewFamOpen(false)}
      />
    </>
  );
}

