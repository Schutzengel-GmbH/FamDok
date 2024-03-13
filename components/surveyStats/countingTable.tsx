import { useResponses, useUsers } from "@/utils/apiHooks";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type CountingTableProps = {
  surveyId: string;
};

export default function CountingTable({ surveyId }: CountingTableProps) {
  const { users } = useUsers();
  const { responses } = useResponses(surveyId);

  const columns: GridColDef[] = [
    { field: "name", width: 200, type: "string", headerName: "Name" },
    { field: "number", width: 200, type: "number", headerName: "Anzahl" },
  ];

  const rows: Record<"name" | "number" | "id", any>[] = users?.map((u) => ({
    id: u.id,
    name: u.name,
    number: responses.reduce(
      (prev, r) => (u.id === r.userId ? prev + 1 : prev),
      0
    ),
  }));

  return (
    <>{users && responses && <DataGrid columns={columns} rows={rows} />}</>
  );
}
