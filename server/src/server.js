import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.routes.js";
import { createAdmin } from "./seed/admin.seed.js";
import { seedDatabase } from "./seed/seedCategories.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect database
await connectDB();

// Security
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Health check
app.use("/api/health", (req, res) => {
  console.log("testing 2");
  res.status(200).json({
    success: true,
    message: "Solace Page API is running successfully.",
  });
});

console.log("testing 1");

// API routes
app.use("/api", apiRoutes);

console.log("API routes set up successfully");

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Centralized error handler
app.use(errorMiddleware);

// seed admin account if it doesn't exist
createAdmin();

// seed categories if they don't exist
seedDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Solace Page API running at address http://localhost:${PORT}`);
});
