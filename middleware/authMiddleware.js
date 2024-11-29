// middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import logger from "../logger.js";
import { BlacklistedToken } from "../models/BlacklistedToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // The token is expected to be in the format "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without token.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Check if the token is blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      logger.warn("Attempt to use a blacklisted token.");
      return res.status(403).json({ error: "Invalid token." });
    }

    // Verify the token
    const user = jwt.verify(token, JWT_SECRET);

    // Attach user and token to the request
    req.user = user;
    req.token = token;

    // Log the username accessing the protected route
    logger.info(`User '${user.username}' is accessing '${req.originalUrl}'`);

    next();
  } catch (err) {
    logger.warn("Invalid token.");
    return res.status(403).json({ error: "Invalid token." });
  }
};
