// controllers/systemStatsController.js

import { SystemStats } from "../models/SystemStats.js";
import os from "os";
import { exec } from "child_process";
import logger from "../logger.js";

// Collect system stats and upload to the database (for POST route)
export const collectSystemStats = async (req, res) => {
  try {
    const memoryUsage = getMemoryUsage();
    const cpuUsage = await getCPUUsage();
    const diskUsage = await getDiskUsage();

    const stats = {
      memory: memoryUsage,
      cpu: cpuUsage,
      disk: diskUsage,
    };

    // Save to database
    const systemStats = new SystemStats(stats);
    await systemStats.save();

    // Log to console
    console.log("System Stats:", stats);

    // Respond to client
    res.status(200).json({ message: "System stats collected and saved.", stats });
  } catch (error) {
    logger.error("Error collecting system stats:", error);
    res.status(500).json({ error: "Failed to collect system stats." });
  }
};

// Get system stats from the database (for GET route)
export const getSystemStats = async (req, res) => {
  try {
    const stats = await SystemStats.find({}).sort({ timestamp: -1 }).limit(10);
    res.status(200).json(stats);
  } catch (error) {
    logger.error("Error retrieving system stats:", error);
    res.status(500).json({ error: "Failed to retrieve system stats." });
  }
};

// Function for cron job to collect stats without HTTP request
export const collectSystemStatsTask = async () => {
  try {
    const memoryUsage = getMemoryUsage();
    const cpuUsage = await getCPUUsage();
    const diskUsage = await getDiskUsage();

    const stats = {
      memory: memoryUsage,
      cpu: cpuUsage,
      disk: diskUsage,
    };

    // Save to database
    const systemStats = new SystemStats(stats);
    await systemStats.save();

    // Log to console
    console.log("System Stats (Cron):", stats);

    // Optionally log to app.log
    logger.info("System stats collected and saved by cron job.");
  } catch (error) {
    logger.error("Error collecting system stats in cron job:", error);
  }
};

// Helper functions
function getMemoryUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;

  return {
    totalMem: formatBytes(totalMem),
    freeMem: formatBytes(freeMem),
    usedMem: formatBytes(usedMem),
    memUsagePercent: parseFloat(memUsagePercent.toFixed(2)),
  };
}

function getCPUUsage() {
  return new Promise((resolve) => {
    const startMeasure = cpuAverage();

    setTimeout(() => {
      const endMeasure = cpuAverage();

      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;

      const cpuUsagePercent = (1 - idleDifference / totalDifference) * 100;

      resolve({
        cpuUsagePercent: parseFloat(cpuUsagePercent.toFixed(2)),
      });
    }, 100);
  });
}

function cpuAverage() {
  const cpus = os.cpus();

  let totalIdle = 0,
    totalTick = 0;

  cpus.forEach((core) => {
    for (let type in core.times) {
      totalTick += core.times[type];
    }
    totalIdle += core.times.idle;
  });

  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length,
  };
}

function getDiskUsage() {
  return new Promise((resolve, reject) => {
    if (os.platform() === "win32") {
      // Windows
      exec("wmic logicaldisk get size,freespace,caption", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const lines = stdout.trim().split("\n");
        const result = lines.filter((line) => line.trim() !== "").slice(1);
        let total = 0;
        let free = 0;

        result.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 3) {
            const [caption, freeSpace, size] = parts;
            total += parseInt(size);
            free += parseInt(freeSpace);
          }
        });

        const used = total - free;
        const usagePercent = (used / total) * 100;

        resolve({
          totalDisk: formatBytes(total),
          usedDisk: formatBytes(used),
          availableDisk: formatBytes(free),
          diskUsagePercent: parseFloat(usagePercent.toFixed(2)),
        });
      });
    } else {
      // Unix
      exec("df -k /", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const lines = stdout.trim().split("\n");
        const diskInfo = lines[lines.length - 1].split(/\s+/);
        const total = parseInt(diskInfo[1]) * 1024; // Convert from kilobytes to bytes
        const used = parseInt(diskInfo[2]) * 1024;
        const available = parseInt(diskInfo[3]) * 1024;
        const usagePercent = parseFloat(diskInfo[4].replace("%", ""));

        resolve({
          totalDisk: formatBytes(total),
          usedDisk: formatBytes(used),
          availableDisk: formatBytes(available),
          diskUsagePercent: parseFloat(usagePercent.toFixed(2)),
        });
      });
    }
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedBytes = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  return formattedBytes;
}
