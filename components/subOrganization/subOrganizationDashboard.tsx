import AdminSubOrganizationsDashboard from "@/components/subOrganization/adminSubOrgDashboard";
import SubOrganizationElement from "@/components/subOrganization/subOrganizationElement";
import ErrorPage from "@/components/utilityComponents/error";
import { useSubOrganizations } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { sortAlphaByKey } from "@/utils/utils";
import { Box, CircularProgress } from "@mui/material";
import { Role } from "@prisma/client";

export default function SubOrganizationDashboard() {
  const { user: me } = useUserData();
  if (me.role === Role.ADMIN) return <AdminSubOrganizationsDashboard />;

  const { suborganizations, isLoading, error, mutate } = useSubOrganizations();

  if (isLoading) return <CircularProgress />;
  if (error) return <ErrorPage message={error} />;

  return (
    <Box>
      {suborganizations.sort(sortAlphaByKey("name")).map((s) => (
        <SubOrganizationElement
          key={s.id}
          initialSubOrganization={s}
          onChange={mutate}
        />
      ))}
      <SubOrganizationElement onChange={mutate} />
    </Box>
  );
}
