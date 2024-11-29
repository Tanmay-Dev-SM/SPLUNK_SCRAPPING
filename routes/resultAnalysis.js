// routes/resultAnalysis.js

import express from "express";
import {
  getAllResultAnalysis,
  getResultAnalysisByCategory,
} from "../controllers/resultAnalysisController.js";

const router = express.Router();

// Get all data
router.get("/", getAllResultAnalysis);

// Get data by category
router.get("/:category", getResultAnalysisByCategory);

export default router;
