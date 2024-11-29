// routes/upload.js

import express from "express";
import { uploadDataToDB } from "../controllers/uploadController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    await uploadDataToDB();
    res.status(200).json({ message: "Data uploaded successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload data." });
  }
});

export default router;
