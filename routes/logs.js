// routes/logs.js

import express from "express";
import { getAllLogs } from "../controllers/logsController.js";

const router = express.Router();

// Get all logs
router.get("/", getAllLogs);

export default router;
