import ai, { MODEL, MAX_TOKENS } from "../config/ai.js";
import { SCORING_PROMPT } from "../prompts/ats.prompts.js";

/**
 * Semantically scores a candidate's resume intelligence against a job's intelligence
 * Uses Claude for context-aware, synonym-aware scoring
 *
 * @param {object} jobIntelligence  - Structured JD data
 * @param {object} resumeIntelligence - Structured resume data
 * @returns {object} Raw dimension scores + explanations
 */
export const scoreCandidate = async (jobIntelligence, resumeIntelligence) => {
const response = await ai.chat.completions.create({
  model: MODEL,
  messages: [
    {
      role: "system",
      content: "You are an expert technical recruiter. Always respond with valid JSON only."
    },
    {
      role: "user",
      content: SCORING_PROMPT(
        JSON.stringify(jobIntelligence, null, 2),
        JSON.stringify(resumeIntelligence, null, 2)
      )
    }
  ],
  max_tokens: MAX_TOKENS
});


  const raw = response.choices[0].message.content.trim();


  try {
    const parsed = JSON.parse(raw);
    return normalizeScores(parsed);
  } catch {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return normalizeScores(JSON.parse(cleaned));
  }
};

const clamp = (v) => Math.min(100, Math.max(0, Number(v) || 0));

const normalizeScores = (data) => ({
  skillMatchScore: clamp(data.skillMatchScore),
  skillMatchReasoning: data.skillMatchReasoning || "",
  experienceScore: clamp(data.experienceScore),
  experienceReasoning: data.experienceReasoning || "",
  projectScore: clamp(data.projectScore),
  projectReasoning: data.projectReasoning || "",
  educationScore: clamp(data.educationScore),
  educationReasoning: data.educationReasoning || "",
  matchedSkills: Array.isArray(data.matchedSkills) ? data.matchedSkills : [],
  missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
  strengths: Array.isArray(data.strengths) ? data.strengths : [],
  concerns: Array.isArray(data.concerns) ? data.concerns : [],
  overallSummary: data.overallSummary || "",
});