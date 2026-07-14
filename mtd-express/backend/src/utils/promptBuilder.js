// src/utils/promptBuilder.js
// Senior SDET prompt engine — D365 domain expert quality output.
// Three-layer approach:
//   1. System prompt  — establishes expert persona (fixed, never user input)
//   2. Domain rules   — app-type specific testing intelligence
//   3. User prompt    — injects the 4 fields + prerequisite steps

// ── Layer 1: Expert persona ───────────────────────────────────────────────────
const SYSTEM_PROMPT_D365 = `You are a Senior SDET with 8+ years of Microsoft Dynamics 365 CRM/ERP testing experience.
You write manual test cases that demonstrate deep D365 domain knowledge.
You always think about: business rules, security roles, field-level security, plugins, OOB vs custom behaviour, lookup relationships, and data integrity.
Your test cases are specific, unambiguous, and cover scenarios a junior tester would miss.
Output ONLY valid JSON. No markdown. No explanation.`;

const SYSTEM_PROMPT_WEB = `You are a Senior SDET with 8+ years of web application testing experience.
You write manual test cases that demonstrate deep knowledge of UI behaviour, API contracts, session management, and edge cases.
Your test cases are specific, unambiguous, and cover scenarios a junior tester would miss.
Output ONLY valid JSON. No markdown. No explanation.`;

// ── Layer 2: Domain intelligence ──────────────────────────────────────────────
const D365_RULES = `
D365 TESTING RULES — apply all that are relevant:
- Always specify the exact security role used to log in (e.g. Club User, System Administrator, Sales Manager)
- Always use "Navigate to" not "Go to" — match D365 navigation language
- When a business rule fires, describe the exact trigger condition and the exact message/behaviour
- Test the same action with DIFFERENT security roles — behaviour must differ
- Test OOB fields AND custom fields separately
- For any save action, verify what happens on the record AFTER save (not just during)
- For lookups: test with valid record, invalid record, and empty value
- For required fields: test saving without them
- For warnings/dialogs: test OK path AND Cancel path as separate steps in the same TC
- Never write "Follow TC1" — expand all prerequisite steps inline
- Step actions must start with a verb: Navigate, Click, Enter, Verify, Change, Open, Select
- Expected results must be specific: include exact field names, exact button names, exact message text where known`;

const WEB_RULES = `
WEB TESTING RULES — apply all that are relevant:
- Always specify the browser and user role/state (logged in, logged out, guest)
- For forms: test valid input, invalid input, empty required fields, boundary values
- For buttons: test enabled state, disabled state, double-click behaviour
- For navigation: test forward, back, deep link, refresh
- For API calls: test success response AND error response (network failure, 400, 500)
- For session: test expired session, concurrent sessions
- Never write "Follow TC1" — expand all prerequisite steps inline
- Step actions must start with a verb: Navigate, Click, Enter, Verify, Submit, Select
- Expected results must be specific: include exact UI text, exact error messages, exact field states`;

// ── Layer 3: JSON schema — compact but complete ───────────────────────────────
const SCHEMA = `Return ONLY this JSON — no markdown, no extra text:
{
  "featureName": "max 6 words",
  "summary": "one sentence — what is being tested and why it matters",
  "totalRisk": "High|Medium|Low",
  "acceptanceCriteria": ["extracted AC 1", "extracted AC 2"],
  "testCases": [
    {
      "id": "TC01",
      "name": "Specific scenario title — include the condition being tested",
      "steps": [
        {
          "no": 1,
          "action": "Verb-first action — be specific about field names, button names, values",
          "expected": "Specific outcome — exact message text, exact field state, exact system behaviour"
        }
      ]
    }
  ],
  "riskAreas": ["specific risk 1"],
  "testDataRequired": ["specific data item 1"],
  "outOfScope": ["item 1"]
}`;

// ── Prerequisite expander ─────────────────────────────────────────────────────
// If user provides prerequisite steps, we tell Claude to inline them
function buildPrereqInstruction(prerequisiteSteps) {
  if (!prerequisiteSteps?.trim()) return "";
  return `
PREREQUISITE STEPS (inline these at the start of every test case — do NOT write "Follow TC1"):
${prerequisiteSteps}
`;
}

// ── Coverage requirements — forces uniqueness and completeness ────────────────
function buildCoverageRules(appType) {
  return `
COVERAGE REQUIREMENTS — generate test cases in this order:
1. Happy path — valid data, correct role, expected success
2. Negative — invalid data or wrong role — system must reject or restrict
3. Boundary — edge values (empty, max length, special characters, null lookups)
4. Security role difference — same action, different role, different outcome
5. Business rule / validation scope — confirm rule fires ONLY when it should
6. Data integrity — verify record state AFTER the action completes
${appType === "dynamics365" ? "7. OOB vs Custom — confirm custom behaviour does not break OOB functionality" : "7. Cross-browser / responsive — confirm behaviour on Edge and Chrome"}

Each test case must:
- Have a unique scenario not covered by any other TC
- Have 3-6 steps (not more, not less)
- Have a specific expected result on EVERY step
- Use exact field names and button names from the feature description
- Demonstrate knowledge that a junior tester would not have`;
}

// ── Main export ───────────────────────────────────────────────────────────────
function buildPrompt({ description, acceptanceCriteria, comments, appType, prerequisiteSteps }) {
  const isD365 = appType === "dynamics365";

  const systemPrompt = isD365 ? SYSTEM_PROMPT_D365 : SYSTEM_PROMPT_WEB;

  const userPrompt =
`FEATURE DESCRIPTION:
${description}

ACCEPTANCE CRITERIA:
${acceptanceCriteria}
${comments ? `\nADDITIONAL CONTEXT:\n${comments}` : ""}
${buildPrereqInstruction(prerequisiteSteps)}
${isD365 ? D365_RULES : WEB_RULES}
${buildCoverageRules(appType)}

${SCHEMA}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildPrompt };