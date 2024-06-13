import FilterComponent, {
  IFilter,
} from "@/components/surveyStats/filterComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { Add, Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";

interface FiltersComponentProps {
  filters: IFilter[];
  survey: FullSurvey;
  onChange: (filters: IFilter[]) => void;
}

export default function FiltersComponent({
  filters,
  survey,
  onChange,
}: FiltersComponentProps) {
  const [newFilter, setNewFilter] = useState<IFilter>();

  function addFilter() {
    onChange([...filters, newFilter]);
    setNewFilter(undefined);
  }

  function updateFilter(updatedFilter: IFilter, index: number) {
    onChange(filters.map((f, i) => (i === index ? updatedFilter : f)));
  }

  function deleteFilter(index: number) {
    onChange(filters.filter((_, i) => i !== index));
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <FilterComponent
          survey={survey}
          filter={newFilter}
          onChange={setNewFilter}
        />
        <IconButton color="primary" onClick={addFilter}>
          <Add />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: ".5rem",
          flexDirection: "column",
          mt: ".5rem",
        }}
      >
        {filters.map((f, i) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <FilterComponent
              survey={survey}
              key={i}
              filter={f}
              onChange={(filter) => updateFilter(filter, i)}
            />
            <IconButton color="primary" onClick={() => deleteFilter(i)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

