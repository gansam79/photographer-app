import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { handleDemo } from "./routes/demo.js";
import clientRoutes from "./routes/clients.js";
import serviceRoutes from "./routes/services.js";
import quotationRoutes from "./routes/quotations.js";
import invoiceRoutes from "./routes/invoices.js";

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

  // API Routes
  app.use("/api/clients", clientRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/quotations", quotationRoutes);
  app.use("/api/invoices", invoiceRoutes);

  return app;
}
