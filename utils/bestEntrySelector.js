// utils/bestEntrySelector.js

import { parseReviews } from "./reviewParser.js";

export function selectBestEntries(data) {
  const groupedByProvider = data.reduce((result, item) => {
    if (!result[item.provider]) result[item.provider] = [];
    result[item.provider].push(item);
    return result;
  }, {});

  const bestEntries = [];

  for (const provider of ["Amazon", "Walmart"]) {
    if (!groupedByProvider[provider]) continue;

    const entries = groupedByProvider[provider];

    entries.sort((a, b) => {
      const starsDiff = b.stars - a.stars;
      if (starsDiff !== 0) return starsDiff;

      const reviewsDiff = parseReviews(b.reviews) - parseReviews(a.reviews);
      if (reviewsDiff !== 0) return reviewsDiff;

      return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
    });

    bestEntries.push(entries[0]);
  }

  return bestEntries;
}
