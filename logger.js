// logger.js

import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), logFormat),
  transports: [new transports.File({ filename: "app.log" }), new transports.Console()],
});

export default logger;