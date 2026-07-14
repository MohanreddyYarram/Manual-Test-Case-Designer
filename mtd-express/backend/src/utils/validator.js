// src/utils/validator.js
const ALLOWED_APP_TYPES = ["web", "dynamics365"];
const MAX = {
  description:        10000,
  acceptanceCriteria: 5000,
  comments:           2000,
  prerequisiteSteps:  3000,
};

function validateInput(body) {
  const errors = [];
  if (!body || typeof body !== "object")
    return { valid: false, errors: ["Body must be JSON"], sanitised: null };

  const { description, acceptanceCriteria, comments, appType, prerequisiteSteps, userStory } = body;

  if (!description?.trim())
    errors.push("description is required");
  else if (description.length > MAX.description)
    errors.push(`description max ${MAX.description} chars`);

  if (!acceptanceCriteria?.trim())
    errors.push("acceptanceCriteria is required");
  else if (acceptanceCriteria.length > MAX.acceptanceCriteria)
    errors.push(`acceptanceCriteria max ${MAX.acceptanceCriteria} chars`);

  if (comments && comments.length > MAX.comments)
    errors.push(`comments max ${MAX.comments} chars`);

  if (prerequisiteSteps && prerequisiteSteps.length > MAX.prerequisiteSteps)
    errors.push(`prerequisiteSteps max ${MAX.prerequisiteSteps} chars`);

  if (appType && !ALLOWED_APP_TYPES.includes(appType))
    errors.push(`appType must be: ${ALLOWED_APP_TYPES.join(", ")}`);

  if (errors.length) return { valid: false, errors, sanitised: null };

  return {
    valid: true,
    errors: [],
    sanitised: {
      description:        description.trim(),
      acceptanceCriteria: acceptanceCriteria.trim(),
      comments:           comments?.trim() || "",
      appType:            appType || "web",
      prerequisiteSteps:  prerequisiteSteps?.trim() || "",
      userStory:          userStory?.trim() || "",
    },
  };
}

module.exports = { validateInput };