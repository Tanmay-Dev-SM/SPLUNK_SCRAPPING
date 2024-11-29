// routes/auth.js

import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Logout a user
router.post("/logout", authenticateToken, logoutUser);

export default router;
