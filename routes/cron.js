// routes/cron.js

import express from "express";
import {
  startScrapingTask,
  stopScrapingTask,
  getScrapingTaskStatus,
} from "../controllers/cronController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { scrapeData } from "../controllers/scrapingController.js";

const router = express.Router();

router.post("/start", authenticateToken, (req, res) => {
  startScrapingTask();
  res.status(200).json({ message: "Scraping task started." });
});

router.post("/stop", authenticateToken, (req, res) => {
  stopScrapingTask();
  res.status(200).json({ message: "Scraping task stopped." });
});

router.get("/status", authenticateToken, (req, res) => {
  const status = getScrapingTaskStatus();
  res.status(200).json({ status });
});

router.post("/run", authenticateToken, async (req, res) => {
  try {
    await scrapeData();
    res.status(200).json({ message: "Scraping task completed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to run scraping task." });
  }
});

export default router;
