// controllers/resultAnalysisController.js

import { ResultAnalysis } from "../models/ResultAnalysis.js";
import logger from "../logger.js";

// Get all data
export const getAllResultAnalysis = async (req, res) => {
  try {
    const data = await ResultAnalysis.find({});
    res.status(200).json(data);
  } catch (error) {
    logger.error("Error fetching all result analysis data:", error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
};

// Get data by category
export const getResultAnalysisByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const data = await ResultAnalysis.findOne({ category: category });
    if (!data) {
      res.status(404).json({ error: "Category not found." });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    logger.error(`Error fetching data for category ${category}:`, error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
};
