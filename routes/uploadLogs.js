// routes/uploadLogs.js

import express from "express";
import { uploadLogsToDB } from "../controllers/logsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    await uploadLogsToDB();
    res.status(200).json({ message: "Logs uploaded successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload logs." });
  }
});

export default router;
