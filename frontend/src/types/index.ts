// ─── Job Types ────────────────────────────────────────────────────────────────

export interface JDIntelligence {
  roleTitle: string;
  seniorityLevel: "junior" | "mid" | "senior" | "lead" | "principal";
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYearsMin: number;
  experienceYearsMax: number | null;
  educationRequirements: {
    degreeLevel: string;
    fields: string[];
  };
  domainContext: string;
  keyResponsibilities: string[];
}

export interface Job {
  _id: string;
  title: string;
  intelligence: JDIntelligence;
  threshold: number;
  candidateCount: number;
  status: "active" | "closed" | "draft";
  createdAt: string;
  updatedAt: string;
}

// ─── Candidate Types ───────────────────────────────────────────────────────────

export type CandidateLabel = "shortlisted" | "borderline" | "rejected";

export interface CandidateScores {
  skillMatch: number;
  experience: number;
  projects: number;
  education: number;
  final: number;
}

export interface CandidateExplanation {
  skillReasoning: string;
  experienceReasoning: string;
  projectReasoning: string;
  educationReasoning: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  summary: string;
}

export interface ResumeIntelligence {
  skills: string[];
  totalExperienceYears: number;
  experienceEntries: {
    title: string;
    company: string;
    durationMonths: number;
    technologies: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    impact: string | null;
  }[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: number | null;
  }[];
  certifications: string[];
}

export interface Candidate {
  _id: string;
  jobId: string;
  name: string;
  email: string | null;
  phone: string | null;
  intelligence: ResumeIntelligence;
  scores: CandidateScores;
  label: CandidateLabel;
  explanation: CandidateExplanation;
  createdAt: string;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CandidateStats {
  shortlisted?: number;
  borderline?: number;
  rejected?: number;
}

export interface CandidatesResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  stats: CandidateStats;
}

export interface BulkResult {
  file: string;
  success: boolean;
  candidateId?: string;
  error?: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type FilterLabel = "all" | CandidateLabel;

export interface LabelConfig {
  color: string;
  bg: string;
  icon: string;
}