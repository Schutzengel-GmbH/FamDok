import useInfoDialog from "@/components/infoDialog/infoDialogContext";
import useToast from "@/components/notifications/notificationContext";
import UsersElement from "@/components/subOrganization/usersElement";
import { FullSubOrganization } from "@/types/prismaHelperTypes";
import { useUserData } from "@/utils/authUtils";
import { Create, Delete, Edit, Save } from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import {
  Box,
  Button,
  IconButton,
  Paper,
  SxProps,
  TextField,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type SubOrganizationElementProps = {
  initialSubOrganization?: FullSubOrganization;
  onChange: () => void;
  sx?: SxProps;
};

export default function SubOrganizationElement({
  initialSubOrganization,
  sx,
  onChange,
}: SubOrganizationElementProps) {
  const { user: me } = useUserData();

  const [subOrganization, setSubOrganization] = useState<
    Partial<FullSubOrganization>
  >({ ...initialSubOrganization });

  const { addToast } = useToast();
  const { showInfoDialog } = useInfoDialog();

  async function onSave() {
    if (initialSubOrganization) {
      const res = await fetch(
        `/api/subOrganizations/${initialSubOrganization.id}`,
        {
          method: "POST",
          body: JSON.stringify(getSubOrganizationUpdateInput(subOrganization)),
        }
      );

      onChange();
      addToast({ message: "Geändert", severity: "success" });
    } else {
      const res = await fetch("/api/subOrganizations", {
        method: "POST",
        body: JSON.stringify(
          getSubOrganizationCreateInput(subOrganization, me.organizationId)
        ),
      });

      if (res.ok) {
        onChange();
        addToast({ message: "Erstellt", severity: "success" });
      } else {
        addToast({ message: `${res.statusText}`, severity: "error" });
      }

      setSubOrganization({});
    }
  }

  async function onDelete() {
    if (!subOrganization.id)
      addToast({ message: "Fehler beim Löschen, keine ID", severity: "error" });

    const res = await fetch(`/api/subOrganizations/${subOrganization.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      onChange();
      addToast({ message: "Gelöscht", severity: "success" });
    } else {
      addToast({ message: `${res.statusText}`, severity: "error" });
    }
  }

  const saveDisabled = subOrganization.name === initialSubOrganization?.name;

  return (
    <Box sx={sx}>
      <Paper
        elevation={3}
        sx={{ p: ".5rem", display: "flex", flexDirection: "row" }}
      >
        <TextField
          sx={{ flexGrow: 1 }}
          value={subOrganization?.name || ""}
          onChange={(e) =>
            setSubOrganization({ ...subOrganization, name: e.target.value })
          }
        />
        {initialSubOrganization && (
          <UsersElement sx={{ flexGrow: 3 }} users={subOrganization.User} />
        )}
        <IconButton
          disabled={initialSubOrganization && saveDisabled}
          color="primary"
          onClick={onSave}
        >
          {initialSubOrganization ? <Save /> : <Add />}
        </IconButton>
        {initialSubOrganization && (
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
}

export function getSubOrganizationCreateInput(
  subOrg: Partial<FullSubOrganization>,
  organizationId: string
): Prisma.SubOrganizationCreateInput {
  return {
    name: subOrg.name,
    organization: { connect: { id: organizationId } },
  };
}

export function getSubOrganizationUpdateInput(
  subOrg: Partial<FullSubOrganization>
): Prisma.SubOrganizationUpdateInput {
  return {
    name: subOrg.name,
  };
}
