import AdminSubOrganizationsDashboard from "@/components/subOrganization/adminSubOrgDashboard";
import SubOrganizationElement from "@/components/subOrganization/subOrganizationElement";
import ErrorPage from "@/components/utilityComponents/error";
import { useSubOrganizations } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { sortAlphaByKey } from "@/utils/utils";
import { Box, CircularProgress } from "@mui/material";
import { Role } from "@prisma/client";

type SubOrganizationDashboardProps = {
  organizationId: string;
};

export default function SubOrganizationDashboard({
  organizationId,
}: SubOrganizationDashboardProps) {
  const { suborganizations, isLoading, error, mutate } =
    useSubOrganizations(organizationId);

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorPage message={error} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {suborganizations.sort(sortAlphaByKey("name")).map((s) => (
        <SubOrganizationElement
          organizationId={organizationId}
          key={s.id}
          initialSubOrganization={s}
          onChange={mutate}
        />
      ))}
      <SubOrganizationElement
        organizationId={organizationId}
        onChange={mutate}
      />
    </Box>
  );
}

