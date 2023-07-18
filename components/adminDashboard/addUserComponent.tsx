import { Cancel, Save } from "@mui/icons-material";
import { TableRow, TableCell, TextField, IconButton } from "@mui/material";
import { Role, Prisma } from "@prisma/client";
import { useState } from "react";
import ErrorDialog from "@/components/utilityComponents/errorDialog";
import RoleSelect from "@/components/adminDashboard/roleSelect";
import OrgSelect from "@/components/adminDashboard/orgSelect";
import { isValidEmail } from "@/utils/validationUtils";
import useNotification from "@/components/utilityComponents/notificationContext";
import { IUsers } from "@/pages/api/user";
import Working from "@/components/utilityComponents/working";
import { useUserData } from "@/utils/authUtils";

export interface AddUserProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function AddUserComponent({ onCancel, onSave }: AddUserProps) {
  const { user } = useUserData();
  const isAdmin = user?.role === Role.ADMIN;

  const { addAlert } = useNotification();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState<Role>(Role.USER);
  const [organization, setOrganization] = useState<
    Partial<Prisma.OrganizationCreateNestedOneWithoutUserInput> | undefined
  >();

  const emailValid = isValidEmail(email);

  const [working, setWorking] = useState<boolean>(false);

  async function save() {
    setWorking(true);
    await fetch(`/api/user`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        role,
        organization,
      } as Prisma.UserCreateInput),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const update = (await res.json()) as IUsers;
        if (res.ok) {
          addAlert({
            message: `${update.user.name || update.user.email} hinzugefügt`,
            severity: "success",
          });
        } else {
          addAlert({
            message: `Fehler beim Erstellen: ${update.error || res.statusText}`,
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
    onSave();
    setWorking(false);
  }

  function cancel() {
    onCancel();
  }

  const valid = isValidEmail(email);

  return (
    <>
      <TableRow>
        <TableCell>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </TableCell>
        <TableCell>
          <TextField
            label="E-Mail"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={!emailValid}
            helperText={!emailValid && "Bitte geben Sie eine gültige E-Mail an"}
          />
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <RoleSelect isAdmin={isAdmin} onChange={(role) => setRole(role)} />
        </TableCell>
        <TableCell>
          {isAdmin && (
            <OrgSelect
              onChange={(organizationId) =>
                setOrganization({ connect: { id: organizationId } })
              }
            />
          )}
        </TableCell>
        <TableCell>
          <IconButton disabled={!valid} onClick={save}>
            <Save />
          </IconButton>
          <IconButton onClick={cancel}>
            <Cancel />
          </IconButton>
        </TableCell>

        <ErrorDialog
          open={Boolean(error)}
          body={`Es ist ein Fehler beim Server aufgetreten: \n${error}`}
          onOK={() => setError("")}
        />
      </TableRow>

      <Working open={working} />
    </>
  );
}
