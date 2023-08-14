import { Cancel, Save } from "@mui/icons-material";
import { TableRow, TableCell, TextField, IconButton } from "@mui/material";
import { Role, Prisma } from "@prisma/client";
import { useState } from "react";
import ErrorDialog from "@/components/utilityComponents/errorDialog";
import RoleSelect from "@/components/adminDashboard/roleSelect";
import OrgSelect from "@/components/adminDashboard/orgSelect";
import { isValidEmail } from "@/utils/validationUtils";
import { IUsers } from "@/pages/api/user";
import { useUserData } from "@/utils/authUtils";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import Loading from "@/components/utilityComponents/loadingMainContent";
import useToast from "@/components/notifications/notificationContext";

export interface AddUserProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function AddUserComponent({ onCancel, onSave }: AddUserProps) {
  const { user } = useUserData();
  const isAdmin = user?.role === Role.ADMIN;

  const { addToast } = useToast();

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
    const res = await apiPostJson<IUsers>("/api/user", {
      name,
      email,
      role,
      organization,
    } as Prisma.UserCreateInput);
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Fehler beim Hinzufügen eines Users: ${res.error}}`,
          severity: "error",
        });

      addToast({
        message: `${res.user.name || res.user.email} hinzugefügt`,
        severity: "success",
      });
    }
    onSave();
    setWorking(false);
  }

  function cancel() {
    onCancel();
  }

  const valid = isValidEmail(email);

  if (working) return <Loading />;

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
    </>
  );
}
