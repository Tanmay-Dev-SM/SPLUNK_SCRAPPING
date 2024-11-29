// utils/textExtractor.js

import fs from "fs";
import { chromium } from "playwright";
import { scrollPage } from "./pageScroller.js";
import { TEXT_FILE } from "../constants.js";
import logger from "../logger.js";

export async function extractVisibleText(url, scrollConfig) {
  logger.info(`Starting extraction of visible text from URL: ${url}`);

  const browser = await chromium.launch({ headless: true }); //!!!!Turn on the headless
  const page = await browser.newPage();

  logger.info(`Navigating to URL: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded" });

  logger.info("Scrolling the page to load dynamic content...");
  await scrollPage(page, scrollConfig.depth, scrollConfig.iterations);

  logger.info("Extracting visible text from the page...");
  const allText = await page.evaluate(() => {
    const elements = document.querySelectorAll("body *");
    const visibleText = [];
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.visibility !== "hidden" && style.display !== "none") {
        const text = el.textContent?.trim();
        if (text) visibleText.push(text);
      }
    });
    return visibleText.join("\n");
  });

  fs.writeFileSync(TEXT_FILE, allText, "utf-8");
  logger.info(`Visible text saved to ${TEXT_FILE}`);

  await browser.close();
  logger.info("Browser closed after text extraction.");

  return allText;
}
