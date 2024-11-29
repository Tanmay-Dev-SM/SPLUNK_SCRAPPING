// constants.js

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const OUTPUT_DIR = path.join(__dirname, "JSON");
export const TEXT_FILE = path.join(OUTPUT_DIR, "page_text_content.txt");
export const OUTPUT_FILE = path.join(OUTPUT_DIR, "api_results_analysis.json");
export const API_ENDPOINT = "http://localhost:8000/api/v1/files/67482e9f63e45abd7bad719b/json";

// Database-related constants
export const DB_NAME = "SPLUNKDB";
export const COLLECTION_NAME = "result_analysisV2";
export const MONGO_URI = process.env.MONGO_URI;
