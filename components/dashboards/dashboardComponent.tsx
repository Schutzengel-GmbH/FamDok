import { FullSurvey } from "@/types/prismaHelperTypes";
import { useResponses } from "@/utils/apiHooks";
import {
  answersPerUserDashboardData,
  dashboardPerUserColumnDefinitions,
  globalOptions,
} from "@/utils/tableUtils";
import { Box } from "@mui/material";
import { Prisma } from "@prisma/client";
import { endOfYear, startOfYear } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";

interface DashboardProps {
  survey: FullSurvey;
}

export default function Dashboard({ survey }) {
  const [startDate, setStartDate] = useState<Date>(startOfYear(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfYear(new Date()));
  const tableRef = useRef();

  const where: Prisma.ResponseWhereInput = {
    AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
  };

  const { responses, isLoading, error } = useResponses(survey.id, where);

  const data = useMemo(
    () => answersPerUserDashboardData(responses),
    [responses, startDate, endDate]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
    >
      <ReactTabulator
        onRef={(ref) => (tableRef.current = ref.current)}
        columns={dashboardPerUserColumnDefinitions}
        data={data}
        style={{}}
        layout="fitData"
        options={{ ...globalOptions }}
      />
    </Box>
  );
}

