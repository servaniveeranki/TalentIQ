"use client";

import CircleScore from "./CircleScore";
import ScoreBar from "./ScoreBar";
import type { Candidate } from "@/types";

const LABEL_STYLE = {
  shortlisted: { color: "var(--green)", bg: "var(--green-dim)", border: "rgba(16,185,129,0.2)" },
  borderline:  { color: "var(--amber)", bg: "var(--amber-dim)", border: "rgba(245,158,11,0.2)" },
  rejected:    { color: "var(--red)",   bg: "var(--red-dim)",   border: "rgba(239,68,68,0.2)"  },
};

const DIMS = [
  { key: "skillMatch" as const, label: "Skill Match",       weight: "50%", color: "var(--violet)" },
  { key: "experience" as const, label: "Experience",        weight: "25%", color: "var(--cyan)"   },
  { key: "projects"   as const, label: "Project Relevance", weight: "15%", color: "var(--amber)"  },
  { key: "education"  as const, label: "Education",         weight: "10%", color: "var(--green)"  },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-3)",
      marginBottom: "10px",
      fontFamily: "'Geist Mono', monospace",
    }}>
      {children}
    </div>
  );
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: "24px", ...style }}>
      {children}
    </div>
  );
}

interface CandidateDetailProps {
  candidate: Candidate;
  onClose?: () => void;
}

export default function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const cfg = LABEL_STYLE[candidate.label];
  const exp = candidate.explanation;

  return (
    <div style={{
      padding: "24px",
      height: "100%",
      overflowY: "auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        paddingBottom: "20px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              {candidate.name}
            </h2>
            <span style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: cfg.color,
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              padding: "2px 8px",
              borderRadius: "4px",
            }}>
              {candidate.label}
            </span>
          </div>
          {candidate.email && (
            <div style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "2px" }}>{candidate.email}</div>
          )}
          {candidate.phone && (
            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>{candidate.phone}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexShrink: 0 }}>
          <CircleScore score={candidate.scores.final} size={72} />
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: "28px", height: "28px",
                background: "var(--bg3)",
                border: "1px solid var(--border-md)",
                borderRadius: "6px",
                color: "var(--text-3)",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Score bars ── */}
      <Section>
        <Label>Score Breakdown</Label>
        {DIMS.map(d => (
          <ScoreBar
            key={d.key}
            label={d.label}
            weight={d.weight}
            score={candidate.scores[d.key]}
            color={d.color}
          />
        ))}
      </Section>

      {/* ── Skills grid ── */}
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <Label>Matched Skills</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {exp.matchedSkills.length > 0 ? (
                exp.matchedSkills.map(s => (
                  <span key={s} style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    color: "var(--green)",
                    background: "var(--green-dim)",
                    fontFamily: "'Geist Mono', monospace",
                  }}>
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>None detected</span>
              )}
            </div>
          </div>
          <div>
            <Label>Missing Skills</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {exp.missingSkills.length > 0 ? (
                exp.missingSkills.map(s => (
                  <span key={s} style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    color: "var(--red)",
                    background: "var(--red-dim)",
                    fontFamily: "'Geist Mono', monospace",
                  }}>
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>No gaps found</span>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Strengths & Concerns ── */}
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <Label>Strengths</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {exp.strengths.map((s, i) => (
                <div key={i} style={{
                  fontSize: "12px",
                  color: "rgba(16,185,129,0.9)",
                  borderLeft: "2px solid var(--green)",
                  paddingLeft: "10px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  background: "var(--green-dim)",
                  borderRadius: "0 5px 5px 0",
                  lineHeight: 1.5,
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Concerns</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {exp.concerns.length > 0 ? (
                exp.concerns.map((s, i) => (
                  <div key={i} style={{
                    fontSize: "12px",
                    color: "rgba(239,68,68,0.9)",
                    borderLeft: "2px solid var(--red)",
                    paddingLeft: "10px",
                    paddingTop: "6px",
                    paddingBottom: "6px",
                    background: "var(--red-dim)",
                    borderRadius: "0 5px 5px 0",
                    lineHeight: 1.5,
                  }}>
                    {s}
                  </div>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>No major concerns</span>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── AI Assessment ── */}
      <Section>
        <Label>AI Assessment</Label>
        <p style={{
          fontSize: "13px",
          color: "var(--text-2)",
          lineHeight: 1.7,
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 6px 6px 0",
          padding: "14px 16px",
          margin: 0,
        }}>
          {exp.summary}
        </p>
      </Section>

      {/* ── Dimension Analysis ── */}
      <Section style={{ marginBottom: 0 }}>
        <Label>Dimension Analysis</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { title: "Skills",     text: exp.skillReasoning,      color: "var(--violet)" },
            { title: "Experience", text: exp.experienceReasoning, color: "var(--cyan)"   },
            { title: "Projects",   text: exp.projectReasoning,    color: "var(--amber)"  },
            { title: "Education",  text: exp.educationReasoning,  color: "var(--green)"  },
          ].map(({ title, text, color }) => (
            <div key={title} style={{
              padding: "12px 14px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${color}`,
              borderRadius: "0 6px 6px 0",
            }}>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                color,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}>
                {title}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}