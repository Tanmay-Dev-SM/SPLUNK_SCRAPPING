// models/SystemStats.js

import mongoose from "mongoose";

const systemStatsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  memory: {
    totalMem: String,
    freeMem: String,
    usedMem: String,
    memUsagePercent: Number,
  },
  cpu: {
    cpuUsagePercent: Number,
  },
  disk: {
    totalDisk: String,
    usedDisk: String,
    availableDisk: String,
    diskUsagePercent: Number,
  },
});

export const SystemStats = mongoose.model("SystemStats", systemStatsSchema, "system_stats");
