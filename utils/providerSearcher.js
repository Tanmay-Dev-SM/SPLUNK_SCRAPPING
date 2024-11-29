// utils/providerSearcher.js

import fs from "fs";
import { TEXT_FILE } from "../constants.js";

export function searchForProviders() {
  const content = fs.readFileSync(TEXT_FILE, "utf-8");
  const lines = content.split("\n");
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Walmart") || line.includes("Amazon")) {
      const provider = line.includes("Walmart") ? "Walmart" : "Amazon";

      const priceMatch = lines
        .slice(i, i + 5)
        .join("\n")
        .match(/\$(\d{1,3}(,\d{3})*(\.\d{2})?)/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(/[\$,]/g, "")) : null;

      const ratingReviewsMatch = lines
        .slice(i, i + 5)
        .join("\n")
        .match(/(\d+(\.\d+)?)(\(\d+(\.\d+)?K?\))/);
      const stars = ratingReviewsMatch ? parseFloat(ratingReviewsMatch[1]) : "No Rating";
      const reviews = ratingReviewsMatch ? ratingReviewsMatch[3] : "No Reviews";

      if (stars && (stars < 1.0 || stars > 5.0)) continue;

      results.push({
        provider,
        price: price ? `$${price.toFixed(2)}` : "No Price",
        stars,
        reviews,
      });
    }
  }

  return results;
}
