// DB/db.js

import mongoose from "mongoose";
import { MONGO_URI, DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
