import { Cancel, Delete, Save } from "@mui/icons-material";
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
import { isValidEmail } from "../../utils/validationUtils";

export interface UserEditProps {
  user: Prisma.UserGetPayload<{ include: { organization: true } }>;
  onChange: () => void;
}

export default function UserDetailComponent({ user, onChange }: UserEditProps) {
  const { user: loggedInUser } = useUserContext();
  const isAdmin = loggedInUser?.role === Role.ADMIN;

  const [changePwDialogOpen, setChangePwDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [organizationId, setOrganizationId] = useState<string | null>(
    user?.organizationId || null
  );
  const [role, setRole] = useState<Role>(user?.role || Role.USER);
  const [confirmDelOpen, setConfirmDelOpen] = useState<boolean>(false);

  const emailValid = isValidEmail(email);

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

  function cantEdit() {
    let cantEdit = false;
    if (loggedInUser.role === Role.CONTROLLER)
      cantEdit = user.role === Role.ADMIN;

    if (loggedInUser.role === Role.ORGCONTROLLER)
      cantEdit = user.organizationId !== loggedInUser.organizationId;

    return cantEdit;
  }

  function handleCancel() {
    setName(user.name);
    setEmail(user.email);
    setOrganizationId(user.organizationId);
    setRole(user.role);
  }

  function handleDeleteClick() {
    setConfirmDelOpen(true);
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        {!cantEdit() && (
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        )}
        {cantEdit() && name}
      </TableCell>
      <TableCell>
        {!cantEdit() && (
          <TextField
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={!emailValid}
            helperText={!emailValid && "Bitte geben Sie eine gültige E-Mail an"}
          />
        )}
        {cantEdit() && email}
      </TableCell>
      <TableCell>
        {!cantEdit() && (
          <Button onClick={() => setChangePwDialogOpen(true)}>Ändern</Button>
        )}
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {!cantEdit() && (
          <RoleSelect
            isAdmin={isAdmin}
            onChange={(role) => setRole(role)}
            value={role}
          />
        )}
        {cantEdit() && role}
      </TableCell>
      <TableCell>
        {!cantEdit() && (
          <OrgSelect
            value={organizationId}
            onChange={(orgId) => setOrganizationId(orgId)}
          />
        )}
        {cantEdit() && (user.organization?.name || "Keine Organisation")}
      </TableCell>
      <TableCell>
        <Tooltip title="Änderungen speichern">
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton
              disabled={!userChanged() || !emailValid || cantEdit()}
              color="primary"
              onClick={handleSaveChanges}
            >
              <Save />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip
          title={
            user.id === loggedInUser.id
              ? "Sie können sich nicht selbst löschen"
              : "Löschen"
          }
        >
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton
              color="primary"
              onClick={handleDeleteClick}
              disabled={user.id === loggedInUser.id || cantEdit()}
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={"Änderungen verwerfen"}>
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton
              color="primary"
              onClick={handleCancel}
              disabled={!userChanged()}
            >
              <Cancel />
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
