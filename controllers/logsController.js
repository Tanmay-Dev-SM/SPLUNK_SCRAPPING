// controllers/logsController.js

import fs from "fs";
import { LogEntry } from "../models/LogEntry.js";
import logger from "../logger.js";

const LAST_POSITION_FILE = "./lastLogPosition.txt";

export const uploadLogsToDB = async () => {
  try {
    // Get the size of app.log
    const stats = fs.statSync("app.log");
    const fileSize = stats.size;

    // Read the last position from file
    let lastPosition = 0;
    if (fs.existsSync(LAST_POSITION_FILE)) {
      lastPosition = parseInt(fs.readFileSync(LAST_POSITION_FILE, "utf-8"), 10);
    }

    // If the file has shrunk, reset the position
    if (fileSize < lastPosition) {
      lastPosition = 0;
    }

    // Read new content from last position
    const fileDescriptor = fs.openSync("app.log", "r");
    const bufferSize = fileSize - lastPosition;
    const buffer = Buffer.alloc(bufferSize);

    fs.readSync(fileDescriptor, buffer, 0, bufferSize, lastPosition);
    fs.closeSync(fileDescriptor);

    const newLogContent = buffer.toString("utf-8");

    // Update last position
    fs.writeFileSync(LAST_POSITION_FILE, fileSize.toString(), "utf-8");

    // Proceed only if there's new content
    if (newLogContent.trim()) {
      const uploadDate = new Date();
      const formattedDate = uploadDate.toISOString();

      const contentToUpload = `Uploaded to db on ${formattedDate}\n${newLogContent}\n`;

      const logEntry = new LogEntry({
        uploadDate,
        content: contentToUpload,
      });

      await logEntry.save();

      logger.info("Logs uploaded to database successfully.");
    } else {
      logger.info("No new logs to upload.");
    }
  } catch (error) {
    logger.error("Error uploading logs to database:", error);
    throw error;
  }
};

// Get all logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await LogEntry.find({}).sort({ uploadDate: -1 });
    res.status(200).json(logs);
  } catch (error) {
    logger.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs." });
  }
};
