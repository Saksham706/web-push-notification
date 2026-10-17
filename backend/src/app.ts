import express from "express";
import cors from "cors";

import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// Allow requests from the React frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

// Parse incoming JSON request bodies
app.use(express.json());

// Health check API
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Web Push Notification backend is running.",
  });
});

// Register notification routes
app.use("/api/notifications", notificationRoutes);

// Handle requests to undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error-handling middleware
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Server error:", error);

    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  },
);

export default app;
