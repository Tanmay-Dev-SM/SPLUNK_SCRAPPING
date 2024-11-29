// controllers/authController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import logger from "../logger.js";
import { BlacklistedToken } from "../models/BlacklistedToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with a secure secret
const JWT_EXPIRES_IN = "1h"; // Token expiration time

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.warn(`Registration attempt with existing username: ${username}`);
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    logger.info(`New user registered: ${username}`);
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt with invalid username: ${username}`);
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for username: ${username}`);
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      username: user.username,
    };

    // Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    logger.info(`User logged in: ${username}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error("Error logging in user:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Logout a user
export const logoutUser = async (req, res) => {
  try {
    const token = req.token; // We'll extract this in the middleware

    // Decode the token to get the expiration time
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds

    // Save the token to the blacklist
    const blacklistedToken = new BlacklistedToken({
      token,
      expiresAt,
    });

    await blacklistedToken.save();

    logger.info(`User logged out: ${req.user.username}`);
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    logger.error("Error logging out user:", error);
    res.status(500).json({ error: "Server error." });
  }
};
