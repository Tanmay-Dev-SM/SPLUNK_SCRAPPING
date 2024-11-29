// utils/deviceProcessor.js

import { extractVisibleText } from "./textExtractor.js";
import { searchForProviders } from "./providerSearcher.js";
import { cleanFilteredData } from "./dataCleaner.js";
import { selectBestEntries } from "./bestEntrySelector.js";
import fs from "fs";
import { TEXT_FILE } from "../constants.js";
import logger from "../logger.js";

export async function processDevice(
  device,
  applyPriceFilter = false,
  scrollConfig = { depth: 500, iterations: 2 }
) {
  try {
    const url = device.LINK;
    logger.info(`Processing device: ${device.Model} with URL: ${url}`);

    await extractVisibleText(url, scrollConfig);

    const results = searchForProviders();
    logger.info(`Found ${results.length} provider entries.`);

    const filteredResults = applyPriceFilter
      ? results.filter((item) => parseFloat(item.price.replace("$", "")) > 200)
      : results;

    logger.info(`Filtered down to ${filteredResults.length} results after applying price filter.`);

    const cleanedData = cleanFilteredData(filteredResults);
    logger.info(`Cleaned data contains ${cleanedData.length} entries.`);

    const bestEntries = selectBestEntries(cleanedData);
    logger.info(`Selected ${bestEntries.length} best entries for the device.`);

    device.Price = bestEntries;

    if (fs.existsSync(TEXT_FILE)) {
      fs.unlinkSync(TEXT_FILE);
      logger.info(`Deleted temporary file: ${TEXT_FILE}`);
    }
  } catch (error) {
    logger.error(`Error processing device: ${device.Model}`, error);
  }
}
