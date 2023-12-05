import SubOrganizationDashboard from "@/components/subOrganization/subOrganizationDashboard";
import ErrorPage from "@/components/utilityComponents/error";
import { useOrganizations } from "@/utils/apiHooks";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function AdminSubOrganizationsDashboard() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const { organizations, isLoading, error } = useOrganizations();

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <ErrorPage
        message={error || "Ein unerwarteter Fehler ist aufgetreten."}
      />
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Select
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      >
        {organizations.map((o) => (
          <MenuItem value={o.id}>{o.name}</MenuItem>
        ))}
      </Select>
      {organizationId && (
        <SubOrganizationDashboard organizationId={organizationId} />
      )}
      {!organizationId && (
        <Typography>Bitte Organisation auswählen.</Typography>
      )}
    </Box>
  );
}

