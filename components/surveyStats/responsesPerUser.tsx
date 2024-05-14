import { useResponses, useUsers } from "@/utils/apiHooks";
import { Box, CircularProgress } from "@mui/material";
import ErrorPage from "../utilityComponents/error";
import DataGrid from "@inovua/reactdatagrid-community";
import "react-data-grid/lib/styles.css";
import { TypeColumn } from "@inovua/reactdatagrid-community/types";
import "@inovua/reactdatagrid-community/index.css"

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
  const columns: TypeColumn[] = [
    { name: "name", width: 200, header: "Name" },
    {
      name: "number",
      width: 200,
      header: "Anzahl",
      sortable: true,
    },
  ];

  const rows = users?.map((u) => ({
    id: u.id,
    name: u.name,
    number: responses.reduce(
      (prev, r) => (u.id === r.userId ? prev + 1 : prev),
      0,
    ),
  }));

  return (
    <Box>
      {users && responses && (
        <DataGrid
          columns={columns}
          dataSource={rows}
          style={{ minHeight: "100%" }}
        />
      )}
    </Box>
  );
}