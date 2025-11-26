import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, getDbStatus } from "./db.js";
import { handleDemo } from "./routes/demo.js";
import clientRoutes from "./routes/clients.js";
import serviceRoutes from "./routes/services.js";
import quotationRoutes from "./routes/quotations.js";
import invoiceRoutes from "./routes/invoices.js";
import authRoutes from "./routes/auth.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB
  connectDB();

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/db-status", (_req, res) => {
    const state = getDbStatus();
    // Map mongoose readyState to human-readable
    const map = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    res.json({ state, status: map[state] ?? "unknown" });
  });

  // Auth routes
  app.use("/api/auth", authRoutes);

  // API Routes
  app.use("/api/clients", clientRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/quotations", quotationRoutes);
  app.use("/api/invoices", invoiceRoutes);

  return app;
}
