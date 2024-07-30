import { useOrganizations, useSubOrganizations } from "@/utils/apiHooks";
import { Box, MenuItem, Select } from "@mui/material";
import { Organization, SubOrganization } from "@prisma/client";

interface SelectOrgOrSuborgProps {
  organization?: Organization;
  subOrganization?: SubOrganization;
  onChange: (
    organization?: Organization,
    subOrganization?: SubOrganization
  ) => void;
}

export default function SelectOrgOrSubOrg({
  organization,
  subOrganization,
  onChange,
}: SelectOrgOrSuborgProps) {
  const { organizations } = useOrganizations();
  const { suborganizations } = useSubOrganizations(organization?.id);

  return (
    <Box>
      {organizations && (
        <Select
          value={organization?.id}
          onChange={(e) =>
            onChange(
              organizations.find(
                (o) => o.id === e.target.value,
                subOrganization
              )
            )
          }
        >
          {organizations.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
      )}
      {suborganizations && suborganizations.length > 0 && (
        <Select
          value={subOrganization?.id}
          onChange={(e) =>
            onChange(
              organization,
              suborganizations.find((o) => o.id === e.target.value)
            )
          }
        >
          {suborganizations.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
}

