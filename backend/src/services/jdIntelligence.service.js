import ai, { MODEL, MAX_TOKENS } from "../config/ai.js";


import { JD_PARSE_PROMPT } from "../prompts/ats.prompts.js";
import { AppError } from "../utils/errorHandler.js";

/**
 * Parses a job description text into structured intelligence JSON using Claude
 * @param {string} jdText - Raw job description text
 * @returns {object} Structured JD intelligence
 */

export const parseJobDescription = async (jdText) => {
  if (!jdText || jdText.trim().length < 50) {
    throw new AppError("Job description is too short (minimum 50 characters).", 400);
  }

  let response;
  try {
    response = await ai.chat.completions.create({
  model: MODEL,
  messages: [
    {
      role: "system",
      content: "You are an expert HR analyst. Always respond with valid JSON only."
    },
    {
      role: "user",
      content: JD_PARSE_PROMPT(jdText)
    }
  ],
  max_tokens: MAX_TOKENS
});


  } catch (err) {
    // Surface Anthropic API errors clearly (wrong model, bad key, rate limit, etc.)
    const detail = err?.message || String(err);
    console.error("Anthropic API error in parseJobDescription:", detail);
    throw new AppError(`AI service error: ${detail}`, 502);
  }

  const raw = response.choices[0].message.content.trim();

  if (!raw) throw new AppError("AI returned an empty response for job description.", 502);

  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return normalizeJDIntelligence(parsed);
  } catch (parseErr) {
    console.error("Failed to parse JD intelligence JSON. Raw:", raw);
    throw new AppError("AI returned invalid JSON for job description.", 502);
  }
};

const normalizeJDIntelligence = (data) => ({
  roleTitle: data.roleTitle || "Unknown Role",
  seniorityLevel: ["junior", "mid", "senior", "lead", "principal"].includes(data.seniorityLevel)
    ? data.seniorityLevel
    : "mid",
  requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
  preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : [],
  experienceYearsMin: Number(data.experienceYearsMin) || 0,
  experienceYearsMax: data.experienceYearsMax ? Number(data.experienceYearsMax) : null,
  educationRequirements: {
    degreeLevel: data.educationRequirements?.degreeLevel || "any",
    fields: Array.isArray(data.educationRequirements?.fields)
      ? data.educationRequirements.fields
      : [],
  },
  domainContext: data.domainContext || "",
  keyResponsibilities: Array.isArray(data.keyResponsibilities)
    ? data.keyResponsibilities
    : [],
});