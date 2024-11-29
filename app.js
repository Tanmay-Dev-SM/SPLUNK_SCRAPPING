// app.js

import axios from "axios";
import fs from "fs";
import { OUTPUT_DIR, OUTPUT_FILE, API_ENDPOINT } from "./constants.js";
import { processCategory } from "./utils/categoryProcessor.js";
import { mergeWithExistingData } from "./utils/dataMerger.js";

// Ensure OUTPUT_DIR exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Main function
(async () => {
  try {
    // Fetch API data
    console.log("Fetching data from API...");
    const apiResponse = await axios.get(API_ENDPOINT);
    const newApiData = apiResponse.data;

    // Load existing data from the output file
    let existingApiData = {};
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log("Loading existing data from output file...");
      const existingContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
      existingApiData = JSON.parse(existingContent);
    } else {
      console.log("No existing data found. Initializing new structure...");
      existingApiData = { statusCode: 200, data: {} };
    }

    // Process categories
    await processCategory(newApiData, "Mobile", true);
    await processCategory(newApiData, "Laptop", false, { depth: 800, iterations: 5 });
    await processCategory(newApiData, "Tablet", false, { depth: 800, iterations: 5 });
    await processCategory(newApiData, "VideoGame Console", false, { depth: 800, iterations: 5 });
    await processCategory(newApiData, "SmartWatch", false, { depth: 800, iterations: 5 });
    await processCategory(newApiData, "Headphone", false, { depth: 800, iterations: 5 });
    await processCategory(newApiData, "Desktops", false, { depth: 800, iterations: 5 });

    // Merge new data into existing data
    console.log("Merging new data with existing data...");
    const updatedApiData = mergeWithExistingData(existingApiData, newApiData);

    // Save updated API data
    console.log("Saving updated API data...");
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedApiData, null, 2), "utf-8");
    console.log(`Updated API data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error:", error);
  }
})();
