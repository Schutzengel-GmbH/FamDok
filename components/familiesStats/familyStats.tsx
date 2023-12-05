import { GRID_LOCALE_TEXT } from "@/components/surveyStats/dataGridLocale";
import CustomGridToolbar from "@/components/surveyStats/gridToolbar";
import ErrorPage from "@/components/utilityComponents/error";
import { IUser } from "@/pages/api/user/[id]";
import { FullFamily } from "@/types/prismaHelperTypes";
import { useFamilies, useMyFamilies } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  deDE,
} from "@mui/x-data-grid";
import { SubOrganization, User } from "@prisma/client";
import { isPast } from "date-fns";
import { useEffect, useState } from "react";

export default function FamilyStats() {
  const [selectedIds, updateSelectedIds] = useState<GridRowSelectionModel>();
  const [rows, setRows] = useState([]);
  const { user } = useUserData();
  const { families, isLoading, mutate, error } =
    user.role === "USER" ? useMyFamilies() : useFamilies();

  useEffect(() => {
    if (!families) return;
    fetch("/api/user").then((res) =>
      res.json().then((json) => {
        setRows(
          families.map((f) => ({
            ...f,
            createdBy: getUserString(json.users.find((u) => u.id === f.userId)),
            subOrg: (
              json.users.find((u) => u.id === f.userId) as User & {
                subOrganizations: SubOrganization[];
              }
            ).subOrganizations.reduce((prev, s) => prev + s.name, ""),
            isClosed: isPast(new Date(f.endOfCare || undefined)),
          }))
        );
      })
    );
  }, [families]);

  const colDef: GridColDef[] = [
    {
      field: "number",
      headerName: "Familiennummer",
      type: "number",
    },
    {
      field: "children",
      headerName: "Kinder",
      description: "Anzahl Kinder im Haushalt",
      type: "number",
      valueGetter(params) {
        return Math.max(params.row.childrenInHousehold, params.value.length);
      },
    },
    { field: "location", headerName: "Wohnort", type: "string" },
    {
      field: "otherInstalledProfessionals",
      type: "string",
      headerName: "Andere installierte Fachkräfte",
      width: 200,
    },
    {
      field: "comingFrom",
      type: "string",
      headerName: "Zugang über",
      width: 200,
    },
    {
      field: "beginOfCare",
      type: "date",
      headerName: "Beginn",
      description: "Beginn der Betreuung",
      valueGetter: (params) => {
        if (params.value) return new Date(params.value);
        else return null;
      },
    },
    {
      field: "isClosed",
      headerName: "Abgeschlossen?",
      type: "boolean",
    },
    {
      field: "endOfCare",
      type: "date",
      headerName: "Ende",
      description: "Ende der Betreuung",
      valueGetter: (params) => {
        if (params.value) return new Date(params.value);
        else return null;
      },
    },
    {
      field: "createdBy",
      headerName: "Verantwortlich",
      type: "string",
      width: 150,
    },
    {
      field: "subOrg",
      headerName: "Unterorganisation",
      type: "string",
      width: 150,
    },
  ];

  return (
    <DataGrid
      columns={colDef}
      rows={rows || []}
      checkboxSelection
      rowSelectionModel={selectedIds}
      onRowSelectionModelChange={(selectionModel) =>
        updateSelectedIds(selectionModel)
      }
      slots={{
        toolbar: () => {
          return CustomGridToolbar("Familien", families);
        },
      }}
    />
  );
}

function getUserString(user?: User) {
  if (!user) return "Kein";
  else return user.name || user.email;
}

