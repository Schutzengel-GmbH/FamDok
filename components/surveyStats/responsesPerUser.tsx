import { useResponses, useUsers } from "@/utils/apiHooks";
import { Box, CircularProgress } from "@mui/material";
import ErrorPage from "../utilityComponents/error";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { Tabulator } from "react-tabulator/lib/types/TabulatorTypes";

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

  const options: Tabulator.Options = { movableColumns: true };

  const columns: ColumnDefinition[] = [
    {
      title: "Name",
      field: "name",
      editable: true,
      editor: "input",
      headerFilter: "input",
    },
    { title: "Anzahl", field: "number" },
  ];

  const rows = users?.map((u) => ({
    id: u.id,
    name: u.name || u.email,
    number: responses.reduce(
      (prev, r) => (u.id === r.userId ? prev + 1 : prev),
      0,
    ),
  }));

  return (
    <ReactTabulator
      columns={columns}
      data={rows}
      index={"id"}
      options={options}
    />
  );
}
