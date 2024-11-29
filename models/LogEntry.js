// models/LogEntry.js

import mongoose from "mongoose";

const logEntrySchema = new mongoose.Schema({
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  content: String,
});

export const LogEntry = mongoose.model("LogEntry", logEntrySchema, "logs");
