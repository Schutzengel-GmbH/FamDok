import { Delete, Save } from "@mui/icons-material";
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { Prisma, Role } from "@prisma/client";
import { useState } from "react";
import ConfirmDialog from "../utilityComponents/confirmDialog";
import ChangePasswordDialog from "./changePassword";
import useNotification from "../utilityComponents/notificationContext";
import { IUser } from "../../pages/api/user/[id]";
import OrgSelect from "./orgSelect";
import RoleSelect from "./roleSelect";
import useUserContext from "../utilityComponents/userDataContext";

export interface UserEditProps {
  user: Prisma.UserGetPayload<{ include: { organization: true } }>;
  onChange: () => void;
}

export default function UserDetailComponent({ user, onChange }: UserEditProps) {
  const { user: reqUser } = useUserContext();
  const isAdmin = reqUser?.role === Role.ADMIN;

  const [changePwDialogOpen, setChangePwDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [organizationId, setOrganizationId] = useState<string | null>(
    user?.organizationId || null
  );
  const [role, setRole] = useState<Role>(user?.role || Role.USER);
  const [confirmDelOpen, setConfirmDelOpen] = useState<boolean>(false);

  const { addAlert } = useNotification();

  function userChanged() {
    return (
      user.name !== name ||
      user.email !== email ||
      user.role !== role ||
      user.organizationId !== organizationId
    );
  }

  async function handleSaveChanges() {
    await fetch(`/api/user/${user.id}`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        organization: organizationId
          ? { connect: { id: organizationId } }
          : undefined,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const update = (await res.json()) as IUser;
        if (res.ok) {
          addAlert({
            message: `${update.user.name || update.user.email} aktualisiert`,
            severity: "success",
          });
        } else {
          addAlert({
            message: `Fehler bei Update: ${update.error || res.statusText}`,
            severity: "error",
          });
        }
      })
      .catch((err) =>
        addAlert({
          message: `Es ist ein Fehler aufgetreten: ${err}`,
          severity: "error",
        })
      );
    onChange();
  }

  async function handleDelete() {
    await fetch(`/api/user/${user.id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          addAlert({ message: "Benutzer gelöscht", severity: "success" });
        } else {
          addAlert({
            message: `Benutzer konnte nicht gelöscht werden: ${res.statusText}`,
            severity: "error",
          });
        }
      })
      .catch((err) =>
        addAlert({
          message: `Es ist ein Fehler aufgetreten: ${err}`,
          severity: "error",
        })
      );
    onChange();
    setConfirmDelOpen(false);
  }

  function handleDeleteClick() {
    setConfirmDelOpen(true);
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </TableCell>
      <TableCell>
        <Button onClick={() => setChangePwDialogOpen(true)}>Ändern</Button>
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <RoleSelect
          isAdmin={isAdmin}
          onChange={(role) => setRole(role)}
          value={role}
        />
      </TableCell>
      <TableCell>
        <OrgSelect
          value={organizationId}
          onChange={(orgId) => setOrganizationId(orgId)}
        />
      </TableCell>
      <TableCell>
        <Tooltip title="Änderungen speichern">
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton
              disabled={!userChanged()}
              color="primary"
              onClick={handleSaveChanges}
            >
              <Save />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip
          title={
            user.id === reqUser.id
              ? "Sie können sich nicht selbst löschen"
              : "Löschen"
          }
        >
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton
              color="primary"
              onClick={handleDeleteClick}
              disabled={user.id === reqUser.id}
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      <ChangePasswordDialog
        open={changePwDialogOpen}
        onClose={() => setChangePwDialogOpen(false)}
        userId={user.id}
      />

      <ConfirmDialog
        open={confirmDelOpen}
        title={"Benutzer löschen?"}
        body={`Möchten Sie diesen Benutzer wirklich löschen? 
        Diese Aktion kann nicht rückgängig gemacht werden`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelOpen(false)}
      />
    </TableRow>
  );
}
