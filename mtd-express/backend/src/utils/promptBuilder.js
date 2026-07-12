// src/utils/promptBuilder.js

function buildPrompt({ description, acceptanceCriteria, comments, appType }) {
  const appLabel = appType === "dynamics365"
    ? "Microsoft Dynamics 365"
    : "Web Application";

  const systemPrompt =
    `You are a Manual QA Engineer. Generate manual test cases as JSON only. No markdown, no explanation.`;

  const userPrompt = `Generate manual test cases for a ${appLabel} feature.

FEATURE: ${description}

ACCEPTANCE CRITERIA: ${acceptanceCriteria}

COMMENTS: ${comments || "None"}

Return ONLY this JSON (no markdown):
{
  "featureName": "5 word max name",
  "summary": "One sentence summary.",
  "totalRisk": "High|Medium|Low",
  "acceptanceCriteria": ["AC1", "AC2"],
  "testCases": [
    {
      "id": "TC001",
      "title": "Title",
      "type": "Positive|Negative|Edge Case|Boundary|UI Validation|Security",
      "priority": "High|Medium|Low",
      "preconditions": "Setup needed",
      "steps": [
        { "no": 1, "action": "Do this", "testData": "Data or N/A" }
      ],
      "expectedResult": "What happens",
      "status": "Not Executed",
      "tags": ["tag"]
    }
  ],
  "riskAreas": ["Risk1"],
  "testDataRequired": ["Data1"],
  "outOfScope": ["Item1"]
}

Generate exactly 6 test cases. Keep each step action under 15 words.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildPrompt };