import { FullSurvey } from "@/types/prismaHelperTypes"
import { useResponses } from "@/utils/apiHooks"
import { allAnswersColumnDefinition, globalOptions, responsesToAllAnswersTable } from "@/utils/tableUtils";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import { useMemo, useRef } from "react";
import { ReactTabulator, } from "react-tabulator"
import StatsFilter from "./filter";

export default function ResponsesTabulator({ survey }: { survey: FullSurvey }) {
  const { responses } = useResponses(survey.id)

  const tableRef = useRef(null);

  const columns = useMemo(() => allAnswersColumnDefinition(survey), [survey]);
  const data = useMemo(() => responsesToAllAnswersTable(responses), [responses, survey]);

  const options = {
  }


  function downlaodCSV() {
    tableRef.current.download("csv", `${survey.name}-${format(new Date(), "yyyy-MM-dd_hh-mm")}.csv`)
  }

  return <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
    <Paper elevation={5} sx={{ width: "90vw", p: ".5rem", position: "sticky" }}><StatsFilter /></Paper>
    <ReactTabulator
      onRef={ref => tableRef.current = ref.current}
      columns={columns}
      data={data}
      style={{}}
      layout="fitData"
      options={{ ...globalOptions, ...options }}
    />
  </Box>
}