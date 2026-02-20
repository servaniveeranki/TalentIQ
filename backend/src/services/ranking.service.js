/**
 * Scoring weights per dimension
 */
export const WEIGHTS = {
  skillMatch: 0.5,
  experience: 0.25,
  projects: 0.15,
  education: 0.1,
};

/**
 * Computes the weighted final score from dimension scores
 * @param {object} dimensionScores
 * @returns {number} Final score 0-100
 */
export const computeFinalScore = (dimensionScores) => {
  const { skillMatchScore, experienceScore, projectScore, educationScore } = dimensionScores;
  return (
    skillMatchScore * WEIGHTS.skillMatch +
    experienceScore * WEIGHTS.experience +
    projectScore * WEIGHTS.projects +
    educationScore * WEIGHTS.education
  );
};

/**
 * Assigns a label based on the final score and threshold
 * @param {number} finalScore
 * @param {number} threshold
 * @returns {"shortlisted"|"borderline"|"rejected"}
 */
export const assignLabel = (finalScore, threshold = 70) => {
  if (finalScore >= threshold) return "shortlisted";
  if (finalScore >= threshold - 10) return "borderline";
  return "rejected";
};

/**
 * Builds the structured scores and explanation objects for DB storage
 */
export const buildCandidateResult = (dimensionScores, finalScore, label) => ({
  scores: {
    skillMatch: Math.round(dimensionScores.skillMatchScore * 10) / 10,
    experience: Math.round(dimensionScores.experienceScore * 10) / 10,
    projects: Math.round(dimensionScores.projectScore * 10) / 10,
    education: Math.round(dimensionScores.educationScore * 10) / 10,
    final: Math.round(finalScore * 10) / 10,
  },
  label,
  explanation: {
    skillReasoning: dimensionScores.skillMatchReasoning,
    experienceReasoning: dimensionScores.experienceReasoning,
    projectReasoning: dimensionScores.projectReasoning,
    educationReasoning: dimensionScores.educationReasoning,
    matchedSkills: dimensionScores.matchedSkills,
    missingSkills: dimensionScores.missingSkills,
    strengths: dimensionScores.strengths,
    concerns: dimensionScores.concerns,
    summary: dimensionScores.overallSummary,
  },
});

/**
 * Re-labels all candidates for a job when threshold changes
 * @param {Array} candidates - Array of candidate docs
 * @param {number} newThreshold
 * @returns {Array} Updated candidates with new labels
 */
export const relabelCandidates = (candidates, newThreshold) =>
  candidates.map((c) => ({
    ...c,
    label: assignLabel(c.scores.final, newThreshold),
  }));