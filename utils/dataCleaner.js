// utils/dataCleaner.js

export function cleanFilteredData(data) {
  return data.filter((item) => item.stars !== "No Rating" && item.reviews !== "No Reviews");
}
