import { useResponses, useUsers } from "@/utils/apiHooks";
import { Box, Button, CircularProgress } from "@mui/material";
import ErrorPage from "../utilityComponents/error";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { Tabulator, TabulatorFull } from "react-tabulator/lib/types/TabulatorTypes";
import { useRef, useState } from "react";
import { globalOptions } from "@/utils/tableUtils";

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

  const tableRef = useRef(null)

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
    <Box sx={{}}>
      <Button onClick={() => tableRef.current.download("csv", "data.csv")}>Download</Button>
      <ReactTabulator
        onRef={(ref) => tableRef.current = ref.current}
        columns={columns}
        data={rows}
        index={"id"}
        options={{ ...globalOptions, ...options }}
      />
    </Box>
  );
}