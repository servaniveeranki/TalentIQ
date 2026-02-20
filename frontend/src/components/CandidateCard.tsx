"use client";

import CircleScore from "./CircleScore";
import type { Candidate } from "@/types";

const LABEL_STYLE = {
  shortlisted: { color: "var(--green)", bg: "var(--green-dim)" },
  borderline:  { color: "var(--amber)", bg: "var(--amber-dim)" },
  rejected:    { color: "var(--red)",   bg: "var(--red-dim)"   },
};

const DIM_COLORS: Record<string, string> = {
  skillMatch: "var(--violet)",
  experience: "var(--cyan)",
  projects:   "var(--amber)",
  education:  "var(--green)",
};

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function CandidateCard({ candidate, rank, isSelected, onClick }: CandidateCardProps) {
  const cfg = LABEL_STYLE[candidate.label];

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        background: isSelected ? "var(--bg3)" : "transparent",
        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
        transition: "all 0.12s ease",
        userSelect: "none",
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = "var(--bg2)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-md)";
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        }
      }}
    >
      {/* Rank */}
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--text-3)",
        width: "20px",
        textAlign: "center",
        flexShrink: 0,
      }}>
        {rank}
      </span>

      {/* Score ring */}
      <CircleScore score={candidate.scores.final} size={44} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {candidate.name}
          </span>
          <span style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: cfg.color,
            background: cfg.bg,
            padding: "2px 6px",
            borderRadius: "4px",
            flexShrink: 0,
          }}>
            {candidate.label}
          </span>
        </div>

        {/* Mini score row */}
        <div style={{ display: "flex", gap: "10px" }}>
          {([
            ["S", candidate.scores.skillMatch, "var(--violet)"],
            ["E", candidate.scores.experience, "var(--cyan)"],
            ["P", candidate.scores.projects,   "var(--amber)"],
            ["Ed",candidate.scores.education,  "var(--green)"],
          ] as [string, number, string][]).map(([k, v, c]) => (
            <span key={k} style={{ fontSize: "11px", color: "var(--text-3)" }}>
              {k}{" "}
              <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 700, color: c }}>
                {Math.round(v)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <span style={{
        fontSize: "12px",
        color: isSelected ? "var(--accent)" : "var(--text-3)",
        flexShrink: 0,
        transition: "color 0.12s",
      }}>
        {isSelected ? "←" : "→"}
      </span>
    </div>
  );
}