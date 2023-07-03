import {
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import AddOrgMenu from "./addOrg";
import { IOrganizations } from "../../pages/api/organizations";
import { fetcher } from "../../utils/swrConfig";

export interface OrgSelectInterface {
  value?: string;
  onChange: (organizationId: string) => void;
}

const OrgSelect = ({ value, onChange }: OrgSelectInterface) => {
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    value
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
    fetcher
  );

  return (
    <>
      <Select value={organizationId} onChange={handleChange}>
        <MenuItem onClick={handleAddOrg}>Neu...</MenuItem>
        {isLoading && (
          <MenuItem disabled>
            <CircularProgress />
          </MenuItem>
        )}
        <MenuItem key={"none"} value={null}>
          Keine Organisation
        </MenuItem>
        {data &&
          data?.organizations?.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
      </Select>

      <AddOrgMenu
        open={addOrgOpen}
        onClose={() => {
          mutate();
          setAddOrgOpen(false);
        }}
      />
    </>
  );
};

export default OrgSelect;
