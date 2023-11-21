import { FullFamily } from "@/types/prismaHelperTypes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type FamilyStatsProps = {
  families: FullFamily[];
};

export default function FamilyStats({ families }: FamilyStatsProps) {
  const colDef: GridColDef[] = [
    { field: "number", headerName: "Familiennummer" },
    {
      field: "children",
      valueGetter(params) {
        return params.value[1]?.number || "";
      },
    },
  ];

  return <DataGrid columns={colDef} rows={families} />;
}

