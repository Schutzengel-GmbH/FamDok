import LogEntry from "@/components/adminDashboard/logEntry";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import ErrorPage from "@/components/utilityComponents/error";
import Loading from "@/components/utilityComponents/loadingMainContent";
import { logger } from "@/config/logger";
import { useLogs } from "@/utils/apiHooks";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { compareDesc, endOfDay, startOfDay } from "date-fns";
import { useState } from "react";

type LogsComponentProps = {};

export function LogsComponent({}: LogsComponentProps) {
  const [level, setLevel] = useState(40);
  const [from, setFrom] = useState(new Date());
  const [til, setTil] = useState(new Date());
  const { logs, isLoading, error } = useLogs(level, from, til);

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  function handleSelectLevel(e: SelectChangeEvent<number>) {
    setLevel(e.target.value as number);
  }

  return (
    <Box sx={{ mt: ".5rem" }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: ".5rem" }}>
        <FormControl>
          <Select label="Log Level" value={level} onChange={handleSelectLevel}>
            <MenuItem value={30}>{logger.levels.labels[30]}</MenuItem>
            <MenuItem value={40}>{logger.levels.labels[40]}</MenuItem>
            <MenuItem value={50}>{logger.levels.labels[50]}</MenuItem>
          </Select>
          <InputLabel>Log Level</InputLabel>
        </FormControl>
        <DatePickerComponent
          label="Von"
          currentAnswer={from}
          onChange={(d, err) => {
            if (!err) setFrom(startOfDay(d));
          }}
        />
        <DatePickerComponent
          label="Bis"
          currentAnswer={til}
          onChange={(d, err) => {
            if (!err) setTil(endOfDay(d));
          }}
        />
      </Box>
      {logs
        .sort((a, b) => compareDesc(new Date(a.time), new Date(b.time)))
        .map((entry) => (
          <LogEntry logEntry={entry} />
        ))}
    </Box>
  );
}

