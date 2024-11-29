// controllers/scrapingController.js

import axios from "axios";
import fs from "fs";
import { OUTPUT_DIR, OUTPUT_FILE, API_ENDPOINT } from "../constants.js";
import { processCategory } from "../utils/categoryProcessor.js";
import { mergeWithExistingData } from "../utils/dataMerger.js";
import logger from "../logger.js";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

export const scrapeData = async () => {
  try {
    logger.info("Fetching data from API...");
    const apiResponse = await axios.get(API_ENDPOINT);
    logger.info("API data fetched successfully.");
    const newApiData = apiResponse.data;

    let existingApiData = {};
    if (fs.existsSync(OUTPUT_FILE)) {
      logger.info("Loading existing data from output file...");
      const existingContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
      existingApiData = JSON.parse(existingContent);
    } else {
      logger.info("No existing data found. Initializing new structure...");
      existingApiData = { statusCode: 200, data: {} };
    }

    // Process categories
    const categories = Object.keys(newApiData.data);
    for (const category of categories) {
      logger.info(`Processing category: ${category}`);
      const applyPriceFilter = category === "Mobile"; // Adjust as needed
      await processCategory(newApiData, category, applyPriceFilter, { depth: 800, iterations: 5 });
    }

    // Merge and save data
    logger.info("Merging new data with existing data...");
    const updatedApiData = mergeWithExistingData(existingApiData, newApiData);

    logger.info("Saving updated API data...");
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedApiData, null, 2), "utf-8");
    logger.info(`Updated API data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      logger.error("Network error: Unable to connect to the internet or API endpoint.", error);
    } else {
      logger.error("Error in scrapeData:", error);
    }
    //throw error; // Re-throw the error if you want to handle it further up
  }
};
