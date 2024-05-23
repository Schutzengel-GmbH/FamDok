import { FullSurvey } from "@/types/prismaHelperTypes"
import { useResponses } from "@/utils/apiHooks"
import { allAnswersColumnDefinition, responsesToAllAnswersTable } from "@/utils/tableUtils";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo, useRef } from "react";
import { ReactTabulator, } from "react-tabulator"

export default function ResponsesTabulator({ survey }: { survey: FullSurvey }) {
  const { responses } = useResponses(survey.id)

  const tableRef = useRef(null);

  const columns = useMemo(() => allAnswersColumnDefinition(survey), [survey]);
  const data = useMemo(() => responsesToAllAnswersTable(responses), [responses, survey]);

  return <Box>
    <Button onClick={() => tableRef.current.download("csv", "data.csv")}>Download</Button>
    <ReactTabulator onRef={ref => tableRef.current = ref.current} columns={columns} data={data} />
  </Box>
}
