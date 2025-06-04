import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // VAPI configuration endpoint (optional)
  app.get("/api/vapi/config", (req, res) => {
    res.json({
      publicKey: process.env.VAPI_PUBLIC_KEY || process.env.VITE_VAPI_PUBLIC_KEY || null,
      // Don't expose private keys in the API response
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
