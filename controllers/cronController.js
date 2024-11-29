// controllers/cronController.js

import cron from "node-cron";
import logger from "../logger.js";
import { scrapeData } from "./scrapingController.js";

let scrapingTask;

export const startScrapingTask = () => {
  if (!scrapingTask) {
    scrapingTask = cron.schedule("0 0 */5 * *", async () => {
      logger.info("Running the scraping function...");
      await scrapeData();
    });
    logger.info("Scraping task started.");
  } else {
    logger.info("Scraping task is already running.");
  }
};

export const stopScrapingTask = () => {
  if (scrapingTask) {
    scrapingTask.stop();
    scrapingTask = null;
    logger.info("Scraping task stopped.");
  } else {
    logger.info("No scraping task is running.");
  }
};

export const getScrapingTaskStatus = () => {
  return scrapingTask ? "running" : "stopped";
};
