import { FamilyCard } from "@/components/family/familyCard";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { FullFamily } from "@/types/prismaHelperTypes";
import { Box, TextField } from "@mui/material";
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

  function fncFilter(family: FullFamily) {
    if (!filter) return true;
    return filter.toLowerCase().includes(family.number.toString());
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <SearchTextField
        label="Filter: Familiennummer"
        filter={filter}
        onChange={setFilter}
      />
      {families?.filter(fncFilter).map((f) => (
        <FamilyCard key={f.id} family={f} onChange={onChange} />
      ))}
    </Box>
  );
}

