// server.js
// Simple Express server — no Azure needed, runs with: node server.js

require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const testRoutes = require("./src/routes/testCases");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", testRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:    "ok",
    service:   "Manual Test Designer API",
    mode:      "Local Express Server (Claude API)",
    timestamp: new Date().toISOString(),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("");
  console.log("  ✦ Manual Test Designer API");
  console.log(`  → Running at: http://localhost:${PORT}`);
  console.log(`  → Health:     http://localhost:${PORT}/api/health`);
  console.log(`  → Generate:   POST http://localhost:${PORT}/api/generate-testcases`);
  console.log("");
});
