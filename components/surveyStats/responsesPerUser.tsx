import { useResponses, useUsers } from "@/utils/apiHooks";
import { CircularProgress } from "@mui/material";
import ErrorPage from "../utilityComponents/error";
import DataGrid, { Column, DataGridProps } from "react-data-grid";
import "react-data-grid/lib/styles.css";

type CountingTableProps = {
  surveyId: string;
};

export default function ResponsesPerUserTable({
  surveyId,
}: CountingTableProps) {
  const { users, error: usersError, isLoading: userssIsLoading } = useUsers();
  const {
    responses,
    error: responsesError,
    isLoading: responsesIsLoading,
  } = useResponses(surveyId);

  if (usersError || responsesError) {
    return <ErrorPage message={usersError || responsesError} />;
  }

  if (responsesIsLoading || userssIsLoading) {
    return <CircularProgress />;
  }
  const columns: Column<any, any>[] = [
    { key: "name", width: 200, name: "Name" },
    {
      key: "number",
      width: 200,
      name: "Anzahl",
      sortable: true,
    },
  ];

  const rows = users?.map((u) => ({
    id: u.id,
    name: u.name,
    number: responses.reduce(
      (prev, r) => (u.id === r.userId ? prev + 1 : prev),
      0
    ),
  }));

  return (
    <>
      {users && responses && (
        <DataGrid
          columns={columns}
          rows={rows}
          onSortColumnsChange={(s) => console.log(s)}
        />
      )}
    </>
  );
}

