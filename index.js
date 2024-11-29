// index.js

import express from "express";
import { connectDB } from "./DB/db.js";
import dotenv from "dotenv";
import cronRouter from "./routes/cron.js";
import logsRouter from "./routes/logs.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import uploadLogsRouter from "./routes/uploadLogs.js";
import resultAnalysisRouter from "./routes/resultAnalysis.js";
import { startScrapingTask } from "./controllers/cronController.js";
import logger from "./logger.js";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// index.js

// ... existing code ...

// Global error handlers
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  // Optionally perform cleanup and exit
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally perform cleanup and exit
  process.exit(1);
});

// Initialize server start counter
let serverStartCount = 0;

// Load previous count from file if exists
const SERVER_COUNT_FILE = "./serverStartCount.txt";
if (fs.existsSync(SERVER_COUNT_FILE)) {
  const count = fs.readFileSync(SERVER_COUNT_FILE, "utf-8");
  serverStartCount = parseInt(count, 10);
}

// Increment the counter and save it
serverStartCount += 1;
fs.writeFileSync(SERVER_COUNT_FILE, serverStartCount.toString(), "utf-8");

logger.info(`Server ${serverStartCount} started.`);

connectDB();

app.use(express.json());

startScrapingTask();

app.use("/auth", authRouter);
app.use("/cron", cronRouter);
app.use("/upload", uploadRouter);
app.use("/upload/logs", uploadLogsRouter);
app.use("/result_analysisV2", resultAnalysisRouter);
app.use("/logs", logsRouter);

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle server stop
process.on("SIGINT", () => {
  logger.info("Server is stopping...");
  server.close(() => {
    logger.info("Server has stopped.");
    process.exit(0);
  });
});
