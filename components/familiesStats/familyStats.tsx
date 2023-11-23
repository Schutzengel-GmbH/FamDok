import { GRID_LOCALE_TEXT } from "@/components/surveyStats/dataGridLocale";
import CustomGridToolbar from "@/components/surveyStats/gridToolbar";
import { IUser } from "@/pages/api/user/[id]";
import { FullFamily } from "@/types/prismaHelperTypes";
import { useUserData } from "@/utils/authUtils";
import { CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";

type FamilyStatsProps = {
  families: FullFamily[];
};

export default function FamilyStats({ families }: FamilyStatsProps) {
  const [selectedIds, updateSelectedIds] = useState<GridRowSelectionModel>();

  const colDef: GridColDef[] = [
    { field: "number", headerName: "Familiennummer" },
    {
      field: "children",
      valueGetter(params) {
        return params.value[1]?.number || "";
      },
    },
    {
      field: "userId",
      valueGetter: (params) => {
        return fetch(`/api/user/${params.value}`)
          .then((res) => {
            if (!res.ok) return "Fehler beim Abrufen der Daten";
            else return "buzz";
            res.json().then((json) => {
              if (json.error) return json.error;
              else if (json.user) return json.user.name || json.user.email;
              else return "Kein";
            });
          })
          .catch((e) => e);
      },
    },
  ];

  return (
    <DataGrid
      columns={colDef}
      rows={families || []}
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
      localeText={GRID_LOCALE_TEXT}
    />
  );
}

