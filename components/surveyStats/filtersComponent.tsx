import FamilyFilterComponent from "@/components/surveyStats/familyFilterComponent";
import FilterComponent from "@/components/surveyStats/filterComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { IFilter, IFamilyFilter } from "@/utils/filters";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { useState } from "react";

interface FiltersComponentProps {
  filters: IFilter[];
  familyFilters: IFamilyFilter[];
  survey: FullSurvey;
  onChange: ({
    filters,
    familyFilters,
  }: {
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
  }) => void;
}

export default function FiltersComponent({
  filters,
  familyFilters,
  survey,
  onChange,
}: FiltersComponentProps) {
  function addFilter() {
    onChange({ filters: [...filters, undefined], familyFilters });
  }

  function updateFilter(updatedFilter: IFilter, index: number) {
    onChange({
      filters: filters.map((f, i) => (i === index ? updatedFilter : f)),
      familyFilters,
    });
  }

  function deleteFilter(index: number) {
    onChange({ filters: filters.filter((_, i) => i !== index), familyFilters });
  }

  function addFamilyFilter() {
    onChange({ filters, familyFilters: [...familyFilters, undefined] });
  }

  function updateFamilyFilter(updatedFilter: IFamilyFilter, index: number) {
    onChange({
      filters,
      familyFilters: familyFilters.map((f, i) =>
        i === index ? updatedFilter : f
      ),
    });
  }

  function deleteFamilyFilter(index: number) {
    onChange({
      familyFilters: familyFilters.filter((_, i) => i !== index),
      filters,
    });
  }

  console.log(filters);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Button onClick={addFilter}>
          <Add /> Fragen-Filter
        </Button>

        {survey.hasFamily && (
          <Button onClick={addFamilyFilter}>
            <Add /> Familien-Filter
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: ".5rem",
          flexDirection: "column",
          mt: ".5rem",
        }}
      >
        {familyFilters.map((f, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <FamilyFilterComponent
              survey={survey}
              key={i}
              familyFilter={f}
              onChange={(familyFilter) => updateFamilyFilter(familyFilter, i)}
            />
            <IconButton color="primary" onClick={() => deleteFamilyFilter(i)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        {filters.map((f, i) => (
          <Box
            key={i}
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

