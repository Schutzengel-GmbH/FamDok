import { useResponses, useUsers } from "@/utils/apiHooks";
import { CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ErrorPage from "../utilityComponents/error";

type CountingTableProps = {
  surveyId: string;
};

export default function ResponsesPerUserTable({ surveyId }: CountingTableProps) {
  const { users, error: usersError, isLoading: userssIsLoading } = useUsers();
  const { responses, error: responsesError, isLoading: responsesIsLoading } = useResponses(surveyId);

  if (usersError || responsesError) {
    return <ErrorPage message={usersError || responsesError} />
  }

  if (responsesIsLoading || userssIsLoading) {
    return <CircularProgress />
  }
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