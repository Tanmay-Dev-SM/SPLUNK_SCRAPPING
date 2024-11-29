// utils/reviewParser.js

export function parseReviews(reviews) {
  if (reviews === "No Reviews") return 0;
  const multiplier = reviews.includes("K") ? 1000 : 1;
  return parseFloat(reviews.replace(/[^\d.]/g, "")) * multiplier;
}
