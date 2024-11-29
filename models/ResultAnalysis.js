// models/ResultAnalysis.js

import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({}, { strict: false });

const resultAnalysisSchema = new mongoose.Schema({
  category: { type: String, required: true },
  devices: [deviceSchema],
});

export const ResultAnalysis = mongoose.model(
  "ResultAnalysis",
  resultAnalysisSchema,
  "result_analysisV2"
);
