import useSWR from "swr";
import useNotification from "../utilityComponents/notificationContext";
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { PersonAdd } from "@mui/icons-material";
import UserDetailComponent from "./userDetailComponent";
import { IUsers } from "../../pages/api/user";
import { fetcher } from "../../utils/swrConfig";
import AddUserComponent from "./addUserComponent";

export default function AdminDashboard() {
  const { addAlert } = useNotification();
  const [addUser, setAddUser] = useState<boolean>(false);

  const { data, mutate, error, isLoading, isValidating } = useSWR<IUsers>(
    "api/user",
    fetcher
  );

  function handleAddUser() {
    setAddUser(true);
  }

  function handleDataUpdate() {
    mutate();
  }

  if (error)
    addAlert({
      message: `Fehler beim Laden der Nutzerdaten: ${error}`,
      severity: "error",
    });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>E-Mail</TableCell>
            <TableCell>Passwort</TableCell>
            <TableCell>Erstellt am</TableCell>
            <TableCell>Rolle</TableCell>
            <TableCell>Organisation</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.users?.map((user) => (
              <UserDetailComponent
                key={user.id}
                user={user}
                onChange={handleDataUpdate}
              />
            ))}
          {addUser && (
            <AddUserComponent
              onCancel={() => {
                setAddUser(false);
              }}
              onSave={() => {
                handleDataUpdate();
                setAddUser(false);
              }}
            />
          )}
          {(isLoading || isValidating) && (
            <TableRow>
              <TableCell>
                <CircularProgress size={20} />
              </TableCell>
              <TableCell>
                <CircularProgress size={20} />
              </TableCell>
              <TableCell>
                <CircularProgress size={20} />
              </TableCell>
              <TableCell>
                <CircularProgress size={20} />
              </TableCell>
              <TableCell>
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          )}
          <TableRow sx={{ m: 2, display: addUser ? "none" : "" }}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <IconButton onClick={handleAddUser}>
                <PersonAdd />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
