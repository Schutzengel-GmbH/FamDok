import { logger } from "@/config/logger";
import { LogEntry } from "@prisma/client";

interface ILogEntryData {
  time: number;
  pid?: string;
  msg?: string;
  endpoint?: string;
  method?: string;
  query?: object;
  body?: object;
  cookie?: string;
  hostname?: string;
  system?: string;
}

type LogEntryProps = {
  logEntry: LogEntry;
};

export default function LogEntry({ logEntry }: LogEntryProps) {
  const data = logEntry.data as unknown as ILogEntryData;
  console.log(logger.levels);
  return (
    <div>
      <p>
        [{new Date(logEntry.time).toLocaleTimeString()}]{" "}
        <span
          style={
            logEntry.level >= 50 ? { color: "red", fontWeight: "bold" } : {}
          }
        >
          {logger.levels.labels[logEntry.level]}
        </span>
        {": "}
        {data.endpoint ?? data.system}
        {": "}
        {data.msg}
      </p>
    </div>
  );
}
