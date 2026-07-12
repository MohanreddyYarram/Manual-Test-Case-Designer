// src/utils/claudeClient.js
const https = require("https");

function callClaudeAPI(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey || apiKey === "your-claude-api-key-here") {
      return reject(new Error("CLAUDE_API_KEY not set in backend/.env"));
    }

    const bodyData = JSON.stringify({
      model:      "claude-haiku-4-5-20251001",  // faster + cheaper than Sonnet
      max_tokens: 4096,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userPrompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path:     "/v1/messages",
      method:   "POST",
      headers: {
        "Content-Type":      "application/json",
        "Content-Length":    Buffer.byteLength(bodyData),
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");

        if (res.statusCode !== 200) {
          return reject(new Error(`Claude API error ${res.statusCode}: ${raw}`));
        }

        try {
          const parsed  = JSON.parse(raw);
          const content = parsed?.content?.find((b) => b.type === "text")?.text;
          if (!content) return reject(new Error("Empty response from Claude"));

          // Strip any markdown fences
          let clean = content.replace(/```json|```/g, "").trim();

          // Extract JSON object safely
          const start = clean.indexOf("{");
          const end   = clean.lastIndexOf("}");
          if (start !== -1 && end > start) {
            clean = clean.substring(start, end + 1);
          }

          resolve(clean);
        } catch (e) {
          reject(new Error("Failed to parse Claude response: " + e.message));
        }
      });
    });

    req.on("error", (e) => reject(new Error("Request failed: " + e.message)));

    // 120 second timeout
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error("Request timed out. Please try again."));
    });

    req.write(bodyData);
    req.end();
  });
}

module.exports = { callClaudeAPI };