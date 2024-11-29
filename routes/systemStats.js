// routes/systemStats.js

import express from "express";
import { collectSystemStats, getSystemStats } from "../controllers/systemStatsController.js";

const router = express.Router();

// POST route to collect and upload stats
router.post("/", collectSystemStats);

// GET route to retrieve stats (not protected)
router.get("/", getSystemStats);

export default router;
