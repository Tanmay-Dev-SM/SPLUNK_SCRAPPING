// utils/categoryProcessor.js

import { processDevice } from "./deviceProcessor.js";
import logger from "../logger.js";

export async function processCategory(
  apiData,
  categoryName,
  applyPriceFilter = false,
  scrollConfig = { depth: 500, iterations: 2 }
) {
  try {
    const devices = apiData?.data?.[categoryName] || [];
    logger.info(`Processing category: ${categoryName} with ${devices.length} devices.`);

    for (const device of devices) {
      logger.info(`Processing device: ${device.Model}`);
      await processDevice(device, applyPriceFilter, scrollConfig);

      const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
      logger.info(`Waiting for ${delay} ms before processing the next device.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  } catch (error) {
    logger.error(`Error processing category: ${categoryName}`, error);
  }
}
