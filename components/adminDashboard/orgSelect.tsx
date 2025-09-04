import {
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import AddOrgMenu from "@/components/adminDashboard/addOrg";
import { IOrganizations } from "@/pages/api/organizations";
import { fetcher } from "@/utils/swrConfig";

export interface OrgSelectInterface {
  value?: string;
  dontShowNoOrg?: boolean;
  dontShowNewOrg?: boolean;
  onChange: (organizationId: string) => void;
}

const OrgSelect = ({
  value,
  dontShowNoOrg,
  dontShowNewOrg,
  onChange,
}: OrgSelectInterface) => {
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    value,
  );
  const [addOrgOpen, setAddOrgOpen] = useState<boolean>(false);

  function handleChange(event: SelectChangeEvent) {
    setOrganizationId(event.target.value);
    onChange(event.target.value);
  }

  function handleAddOrg() {
    setAddOrgOpen(true);
  }

  const { data, mutate, isLoading } = useSWR<IOrganizations>(
    "api/organizations",
    fetcher,
  );

  return (
    <>
      {isLoading && <CircularProgress />}
      {data && (
        <Select value={organizationId} onChange={handleChange}>
          {!dontShowNewOrg && (
            <MenuItem onClick={handleAddOrg}>Neu...</MenuItem>
          )}

          {!dontShowNoOrg && (
            <MenuItem key={"none"} value={"none"}>
              Keine Organisation
            </MenuItem>
          )}
          {data &&
            data.organizations?.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
        </Select>
      )}

      <AddOrgMenu
        open={addOrgOpen}
        onClose={(id) => {
          mutate();
          setAddOrgOpen(false);
          setOrganizationId(id);
          onChange(id);
        }}
      />
    </>
  );
};

export default OrgSelect;
