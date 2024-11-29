// controllers/uploadController.js

import fs from "fs";
import { ResultAnalysis } from "../models/ResultAnalysis.js";
import { OUTPUT_FILE } from "../constants.js";
import logger from "../logger.js";

export const uploadDataToDB = async () => {
  try {
    const jsonData = fs.readFileSync(OUTPUT_FILE, "utf-8");
    const data = JSON.parse(jsonData);
    const devicesData = data.data;

    const documents = [];

    for (const category in devicesData) {
      const devices = devicesData[category];
      const categoryDocument = { category, devices };
      documents.push(categoryDocument);
    }

    // Clear existing collection if needed
    await ResultAnalysis.deleteMany({});

    // Insert category documents into the database
    await ResultAnalysis.insertMany(documents);

    logger.info("Data uploaded successfully.");
  } catch (error) {
    logger.error("Error uploading data:", error);
    throw error;
  }
};
