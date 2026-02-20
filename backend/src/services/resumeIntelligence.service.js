import ai, { MODEL, MAX_TOKENS } from "../config/ai.js";
import { RESUME_PARSE_PROMPT } from "../prompts/ats.prompts.js";

/**
 * Parses a resume text into structured intelligence JSON using Claude
 * @param {string} resumeText - Raw resume text
 * @returns {object} Structured resume intelligence (no PII beyond name/email/phone)
 */
export const parseResume = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 30) {
    throw new Error("Resume text is too short or empty.");
  }

  const response = await ai.chat.completions.create({
  model: MODEL,
  messages: [
    {
      role: "system",
      content: "You are an expert resume parser. Always respond with valid JSON only."
    },
    {
      role: "user",
      content: RESUME_PARSE_PROMPT(resumeText)
    }
  ],
  max_tokens: MAX_TOKENS
});


  const raw = response.choices[0].message.content.trim();


  try {
    const parsed = JSON.parse(raw);
    return normalizeResumeIntelligence(parsed);
  } catch {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return normalizeResumeIntelligence(JSON.parse(cleaned));
  }
};

const normalizeResumeIntelligence = (data) => ({
  candidateName: data.candidateName || "Unknown",
  email: data.email || null,
  phone: data.phone || null,
  skills: Array.isArray(data.skills) ? data.skills : [],
  totalExperienceYears: Number(data.totalExperienceYears) || 0,
  experienceEntries: Array.isArray(data.experienceEntries)
    ? data.experienceEntries.map((e) => ({
        title: e.title || "",
        company: e.company || "",
        durationMonths: Number(e.durationMonths) || 0,
        technologies: Array.isArray(e.technologies) ? e.technologies : [],
      }))
    : [],
  projects: Array.isArray(data.projects)
    ? data.projects.map((p) => ({
        name: p.name || "",
        description: p.description || "",
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        impact: p.impact || null,
      }))
    : [],
  education: Array.isArray(data.education)
    ? data.education.map((e) => ({
        degree: e.degree || "",
        field: e.field || "",
        institution: e.institution || "",
        year: e.year ? Number(e.year) : null,
      }))
    : [],
  certifications: Array.isArray(data.certifications) ? data.certifications : [],
});