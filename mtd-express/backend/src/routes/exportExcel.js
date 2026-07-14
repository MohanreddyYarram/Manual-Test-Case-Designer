// src/routes/exportExcel.js
// POST /api/export-excel
// Accepts the full result JSON + userStory, returns .xlsx file

const express              = require("express");
const router               = express.Router();
const { generateExcel }    = require("../utils/excelExport");

router.post("/export-excel", async (req, res) => {
  const { result, userStory } = req.body;

  if (!result?.testCases?.length) {
    return res.status(400).json({ error: "No test cases to export" });
  }

  try {
    const buffer   = await generateExcel(result, userStory || "");
    const filename = `${(result.featureName || "test-cases").replace(/\s+/g, "_")}.xlsx`;

    res.setHeader("Content-Type",        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error("Excel export error:", err.message);
    res.status(500).json({ error: "Excel generation failed", details: err.message });
  }
});

module.exports = router;