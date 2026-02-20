import type { CandidateLabel, LabelConfig } from "@/types";

export const LABEL_CONFIG: Record<CandidateLabel, LabelConfig> = {
  shortlisted: { color: "#00d97e", bg: "rgba(0,217,126,0.10)", icon: "✓" },
  borderline:  { color: "#f5a623", bg: "rgba(245,166,35,0.10)",  icon: "~" },
  rejected:    { color: "#ff4757", bg: "rgba(255,71,87,0.10)",   icon: "✗" },
};

export const SCORE_DIMENSIONS = [
  { key: "skillMatch",  label: "Skill Match",        weight: "50%", color: "#6366f1" },
  { key: "experience",  label: "Experience",          weight: "25%", color: "#06b6d4" },
  { key: "projects",    label: "Project Relevance",   weight: "15%", color: "#f59e0b" },
  { key: "education",   label: "Education",           weight: "10%", color: "#10b981" },
] as const;