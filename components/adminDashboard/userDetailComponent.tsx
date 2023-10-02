import { Cancel, Delete, Password, Save } from "@mui/icons-material";
import {
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { Prisma, Role } from "@prisma/client";
import { useState } from "react";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { IUser } from "@/pages/api/user/[id]";
import OrgSelect from "@/components/adminDashboard/orgSelect";
import RoleSelect from "@/components/adminDashboard/roleSelect";
import { isValidEmail } from "@/utils/validationUtils";
import { useUserData } from "@/utils/authUtils";
import { FetchError, apiDelete, apiPostJson } from "@/utils/fetchApiUtils";
import useToast from "@/components/notifications/notificationContext";
import useInfoDialog from "@/components/infoDialog/infoDialogContext";
import { IPasswordResetLink } from "@/pages/api/auth/passwordResetLink";

export interface UserEditProps {
  user: Prisma.UserGetPayload<{ include: { organization: true } }>;
  onChange: () => void;
}

export default function UserDetailComponent({ user, onChange }: UserEditProps) {
  const { user: loggedInUser } = useUserData();
  const isAdmin = loggedInUser?.role === Role.ADMIN;

  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [organizationId, setOrganizationId] = useState<string | "none">(
    user?.organizationId || "none"
  );
  const [role, setRole] = useState<Role>(user?.role || Role.USER);
  const [confirmDelOpen, setConfirmDelOpen] = useState<boolean>(false);

  const emailValid = isValidEmail(email);

  const { addToast } = useToast();
  const { showInfoDialog } = useInfoDialog();

  function userChanged() {
    return (
      user.name !== name ||
      user.email !== email ||
      user.role !== role ||
      (user.organizationId !== organizationId &&
        !(!user.organizationId && organizationId === "none"))
    );
  }

  async function handleSaveChanges() {
    const res = await apiPostJson<IUser>(`/api/user/${user.id}`, {
      name,
      email,
      organization: organizationId
        ? { connect: { id: organizationId } }
        : undefined,
      role,
    });
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Fehler beim Update eines Users: ${res.error}}`,
          severity: "error",
        });

      addToast({
        message: `${res.user.name || res.user.email} aktualisiert`,
        severity: "success",
      });
    }
    onChange();
  }

  async function handleDelete() {
    const res = await apiDelete<IUser>(`/api/user/${user.id}`);
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Benutzer konnte nicht gelöscht werden: ${res.error}`,
          severity: "error",
        });

      addToast({
        message: "Benutzer gelöscht",
        severity: "success",
      });
    }
    onChange();
    setConfirmDelOpen(false);
  }

  async function handlePassword() {
    const res = await apiPostJson<IPasswordResetLink>(
      "/api/auth/passwordResetLink",
      {
        email,
      }
    );
    if (res instanceof FetchError || res.error) {
      addToast({
        message: `Etwas ist schiefgelaufen: ${res.error}`,
        severity: "error",
      });
    } else showInfoDialog({ title: "Reset-Link", body: res.link });
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

        <Tooltip title={"Link für Passwort-Reset generieren"}>
          {/* span because: A disabled element does not fire events. */}
          <span>
            <IconButton color="primary" onClick={handlePassword}>
              <Password />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

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
