import { FullSurvey } from "@/types/prismaHelperTypes";
import {
  useOrganizations,
  useResponses,
  useSubOrganizations,
} from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

type ResponsesPerSubOrgProps = {
  survey: FullSurvey;
};

export default function ResponsesPerSubOrg({
  survey,
}: ResponsesPerSubOrgProps) {
  const { user } = useUserData();
  const isAdmin = user.role === Role.ADMIN || user.role === Role.CONTROLLER;
  const { organizations } = useOrganizations();
  const [orgId, setOrgId] = useState("");
  const { suborganizations } = useSubOrganizations(orgId);
  const { responses } = useResponses(survey.id);

  useEffect(() => {
    if (isAdmin) return;
    else setOrgId(user.organizationId);
  }, [user]);

  const columns: GridColDef[] = [
    {
      field: "subOrganization",
      width: 200,
      type: "string",
      headerName: "Unterorganisation",
    },
    { field: "number", width: 200, type: "number", headerName: "Anzahl" },
  ];

  const rows: Record<"subOrganization" | "number" | "id", any>[] =
    suborganizations?.map((s) => ({
      id: s.id,
      subOrganization: s.name,
      number: responses?.reduce(
        (n, r) =>
          r.user?.subOrganizations?.find((us) => us.id === s.id) ? n + 1 : n,
        0,
      ),
    }));

  function handleOrgChange(e: SelectChangeEvent) {
    setOrgId(e.target.value);
  }

  return (
    <Box>
      {isAdmin && (
        <Select value={orgId} onChange={handleOrgChange}>
          {organizations?.map((o) => (
            <MenuItem value={o.id} key={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
      )}
      <DataGrid columns={columns} rows={rows || []} />
    </Box>
  );
}

