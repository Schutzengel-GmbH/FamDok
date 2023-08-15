import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      level: "info",
      target: "pino/file",
      options: { destination: `./app.log` },
    },
  ],
});

export const logger = pino(transport);

logger.info("Logger initialized.");

