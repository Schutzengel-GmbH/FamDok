import FamilyFilterComponent from "@/components/surveyStats/familyFilterComponent";
import FilterComponent from "@/components/surveyStats/filterComponent";
import GeneralFilterComponent from "@/components/surveyStats/generalFilterComponent";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { IFilter, IFamilyFilter, IGeneralFilter } from "@/utils/filters";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { useState } from "react";

interface FiltersComponentProps {
  filters: IFilter[];
  familyFilters: IFamilyFilter[];
  generalFilters: IGeneralFilter[];
  survey: FullSurvey;
  onChange: ({
    filters,
    familyFilters,
    generalFilters,
  }: {
    filters: IFilter[];
    familyFilters?: IFamilyFilter[];
    generalFilters?: IGeneralFilter[];
  }) => void;
  onApply?: () => void;
}

export default function FiltersComponent({
  filters,
  familyFilters,
  generalFilters,
  survey,
  onApply,
  onChange,
}: FiltersComponentProps) {
  function addFilter() {
    onChange({
      filters: [...filters, undefined],
      familyFilters,
      generalFilters,
    });
  }

  function updateFilter(updatedFilter: IFilter, index: number) {
    onChange({
      filters: filters.map((f, i) => (i === index ? updatedFilter : f)),
      familyFilters,
      generalFilters,
    });
  }

  function deleteFilter(index: number) {
    onChange({
      filters: filters.filter((_, i) => i !== index),
      familyFilters,
      generalFilters,
    });
  }

  function addFamilyFilter() {
    onChange({
      filters,
      familyFilters: [...familyFilters, undefined],
      generalFilters,
    });
  }

  function updateFamilyFilter(updatedFilter: IFamilyFilter, index: number) {
    onChange({
      filters,
      familyFilters: familyFilters.map((f, i) =>
        i === index ? updatedFilter : f
      ),
      generalFilters,
    });
  }

  function deleteFamilyFilter(index: number) {
    onChange({
      familyFilters: familyFilters.filter((_, i) => i !== index),
      filters,
      generalFilters,
    });
  }

  function addGeneralFilter() {
    onChange({
      filters,
      familyFilters,
      generalFilters: [...generalFilters, undefined],
    });
  }

  function updateGeneralFilter(updatedFilter: IGeneralFilter, index: number) {
    onChange({
      filters,
      familyFilters,
      generalFilters: generalFilters.map((f, i) =>
        i === index ? updatedFilter : f
      ),
    });
  }

  function deleteGeneralFilter(index: number) {
    onChange({
      familyFilters,
      filters,
      generalFilters: generalFilters.filter((_, i) => i !== index),
    });
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
        <Button onClick={addFilter}>
          <Add /> Fragen-Filter
        </Button>

        {survey.hasFamily && (
          <Button onClick={addFamilyFilter}>
            <Add /> Familien-Filter
          </Button>
        )}

        <Button onClick={addGeneralFilter}>
          <Add /> Allgemeiner Filter
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: ".5rem",
          flexDirection: "column",
          mt: ".5rem",
        }}
      >
        {generalFilters?.map((f, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <GeneralFilterComponent
              survey={survey}
              key={i}
              generalFilter={f}
              onChange={(filter) => updateGeneralFilter(filter, i)}
            />
            <IconButton color="primary" onClick={() => deleteGeneralFilter(i)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
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
      {onApply && <Button onClick={onApply}>Filter anwenden</Button>}
    </Box>
  );
}

