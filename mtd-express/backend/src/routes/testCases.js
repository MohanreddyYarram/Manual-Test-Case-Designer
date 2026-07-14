// src/routes/testCases.js
const express           = require("express");
const router            = express.Router();
const { validateInput } = require("../utils/validator");
const { buildPrompt }   = require("../utils/promptBuilder");
const { callClaudeAPI } = require("../utils/claudeClient");

router.post("/generate-testcases", async (req, res) => {

  const { valid, errors, sanitised } = validateInput(req.body);
  if (!valid) {
    console.log("Validation failed:", errors);
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  console.log(`→ Generating | appType=${sanitised.appType} | hasPrereqs=${!!sanitised.prerequisiteSteps}`);

  let rawContent;
  try {
    const { systemPrompt, userPrompt } = buildPrompt(sanitised);
    rawContent = await callClaudeAPI(systemPrompt, userPrompt);
    console.log(`→ Claude responded | ${rawContent.length} chars`);
  } catch (err) {
    console.error("Claude API error:", err.message);
    return res.status(502).json({ error: "AI generation failed", details: err.message });
  }

  let result;
  try {
    result = JSON.parse(rawContent);
  } catch (parseErr) {
    console.error("JSON parse failed:", rawContent?.substring(0, 500));
    return res.status(500).json({ error: "AI returned invalid JSON. Please retry." });
  }

  // Attach userStory to result for Excel export
  result.userStory = sanitised.userStory;

  console.log(`✓ Done | ${result.testCases?.length} test cases`);
  res.json(result);
});

module.exports = router;