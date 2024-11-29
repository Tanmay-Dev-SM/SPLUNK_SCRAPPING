// models/BlacklistedToken.js

import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Create a TTL index on `expiresAt` to automatically remove expired tokens
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export the model
export const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema,
  "blacklisted_tokens"
);
