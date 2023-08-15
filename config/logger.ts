import pino from "pino";
import databaseTransport from "@/config/databaseTransport";

export const logger = pino(databaseTransport({}));

logger.info("Logger initialized.");

