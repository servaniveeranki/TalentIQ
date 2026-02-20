export const JD_PARSE_PROMPT = (jdText) => `You are an expert HR analyst. Parse this job description and extract structured information.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "roleTitle": "string",
  "seniorityLevel": "junior|mid|senior|lead|principal",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "experienceYearsMin": 0,
  "experienceYearsMax": null,
  "educationRequirements": {
    "degreeLevel": "high_school|associate|bachelor|master|phd|any",
    "fields": ["Computer Science", "Engineering"]
  },
  "domainContext": "string describing industry/domain context",
  "keyResponsibilities": ["responsibility1", "responsibility2"]
}

Job Description:
${jdText}`;

export const RESUME_PARSE_PROMPT = (resumeText) => `You are an expert resume parser. Extract all structured information from this resume.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "candidateName": "string",
  "email": "string or null",
  "phone": "string or null",
  "skills": ["skill1", "skill2"],
  "totalExperienceYears": 0,
  "experienceEntries": [
    {
      "title": "string",
      "company": "string",
      "durationMonths": 0,
      "technologies": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "impact": "string or null"
    }
  ],
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "year": null
    }
  ],
  "certifications": ["string"]
}

Resume:
${resumeText}`;

export const SCORING_PROMPT = (jobJson, candidateJson) => `You are an expert technical recruiter. Score this candidate against job requirements with semantic understanding.

IMPORTANT: Use semantic matching — React = ReactJS, JS = JavaScript, Node = Node.js, ML = Machine Learning, etc.
Consider transferable skills and domain relevance when scoring.

Score each dimension 0–100 and provide detailed reasoning.

Return ONLY valid JSON (no markdown, no explanation):
{
  "skillMatchScore": 0,
  "skillMatchReasoning": "string",
  "experienceScore": 0,
  "experienceReasoning": "string",
  "projectScore": 0,
  "projectReasoning": "string",
  "educationScore": 0,
  "educationReasoning": "string",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["string"],
  "concerns": ["string"],
  "overallSummary": "2-3 sentence summary of candidate fit"
}

Job Requirements:
${jobJson}

Candidate Profile:
${candidateJson}`;