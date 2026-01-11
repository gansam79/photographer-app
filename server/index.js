import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import { connectDB, getDbStatus } from "./db.js";
import { handleDemo } from "./routes/demo.js";
import clientRoutes from "./routes/clientRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
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

  // Serve SPA fallback only in production builds (Vite handles this in dev)
  if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res, next) => {
      try {
        if (req.method !== "GET") return next();
        const p = req.path || "/";
        if (p.startsWith("/api") || p.startsWith("/dist") || p.includes(".")) return next();
        res.sendFile(path.resolve(process.cwd(), "index.html"));
      } catch (e) {
        next(e);
      }
    });
  }

  return app;
}


