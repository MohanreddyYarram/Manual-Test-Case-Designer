// src/routes/testCases.js
const express           = require("express");
const router            = express.Router();
const { validateInput } = require("../utils/validator");
const { buildPrompt }   = require("../utils/promptBuilder");
const { callClaudeAPI } = require("../utils/claudeClient");

router.post("/generate-testcases", async (req, res) => {

  // 1. Validate
  const { valid, errors, sanitised } = validateInput(req.body);
  if (!valid) {
    console.log("Validation failed:", errors);
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  // 2. Call Claude
  console.log(`→ Generating | appType=${sanitised.appType}`);
  let rawContent;
  try {
    const { systemPrompt, userPrompt } = buildPrompt(sanitised);
    rawContent = await callClaudeAPI(systemPrompt, userPrompt);
    console.log(`→ Claude responded | length=${rawContent.length} chars`);
  } catch (err) {
    console.error("Claude API error:", err.message);
    return res.status(502).json({ error: "AI generation failed", details: err.message });
  }

  // 3. Parse JSON
  let result;
  try {
    result = JSON.parse(rawContent);
  } catch (parseErr) {
    // Log the full raw content so we can see what went wrong
    console.error("JSON parse failed:", parseErr.message);
    console.error("Raw content (first 500 chars):", rawContent?.substring(0, 500));
    console.error("Raw content (last 200 chars):",  rawContent?.slice(-200));
    return res.status(500).json({ error: "AI returned invalid JSON. Please retry." });
  }

  console.log(`✓ Done | standard=${result.standardTestCases?.length} bdd=${result.bddTestCases?.length}`);
  res.json(result);
});

module.exports = router;