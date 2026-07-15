// server.js
require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const testRoutes   = require("./src/routes/testCases");
const exportRoutes = require("./src/routes/exportExcel");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));  // allow large result JSON for export

app.use("/api", testRoutes);
app.use("/api", exportRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status:    "ok",
    service:   "Manual Test Designer API",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log("");
  console.log("  ✦ Manual Test Designer API");
  console.log(`  → Running at: http://localhost:${PORT}`);
  console.log(`  → Health:     http://localhost:${PORT}/api/health`);
  console.log(`  → Generate:   POST http://localhost:${PORT}/api/generate-testcases`);
  console.log(`  → Export:     POST http://localhost:${PORT}/api/export-excel`);
  console.log("");
});