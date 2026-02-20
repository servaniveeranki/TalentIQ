"use client";

import { useState } from "react";

const DEMO_JD = `Senior Frontend Engineer

We are looking for a Senior Frontend Engineer to join our growing team.

Required Skills:
- 5+ years of React.js / ReactJS experience
- TypeScript proficiency
- Node.js backend experience
- AWS cloud services
- Strong CSS / SCSS skills
- GraphQL & REST APIs

Preferred Skills:
- Next.js, Docker, CI/CD pipelines, Jest, Cypress

Experience: 5+ years in software development
Education: Bachelor's degree in Computer Science or related field

Key Responsibilities:
- Build and own scalable frontend architecture
- Lead technical decisions across the engineering team
- Mentor junior developers
- Collaborate with product and design teams`;

interface UploadPageProps {
  onJobCreated: (title: string, content: string, threshold: number) => void;
  loading: boolean;
}

const WEIGHTS = [
  { pct: "50%", label: "Skill Match",  color: "var(--violet)" },
  { pct: "25%", label: "Experience",   color: "var(--cyan)"   },
  { pct: "15%", label: "Projects",     color: "var(--amber)"  },
  { pct: "10%", label: "Education",    color: "var(--green)"  },
];

export default function UploadPage({ onJobCreated, loading }: UploadPageProps) {
  const [title, setTitle]       = useState("");
  const [jdText, setJdText]     = useState("");
  const [threshold, setThreshold] = useState(70);
  const canSubmit = Boolean(title.trim() && jdText.trim());

  const handleSubmit = () => {
    if (canSubmit) onJobCreated(title.trim(), jdText.trim(), threshold);
  };

  // Threshold label ranges
  const tShortlist  = `≥ ${threshold}`;
  const tBorderline = `${threshold - 10} – ${threshold - 1}`;
  const tRejected   = `< ${threshold - 10}`;

  return (
    <div style={{ width: "100%", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            background: "var(--accent-dim)",
            padding: "5px 12px",
            borderRadius: "20px",
            marginBottom: "20px",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Beyond Keyword Matching
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--text)",
            marginBottom: "16px",
          }}>
            Understand candidates,
            <br />
            <span style={{ color: "var(--accent)" }}>not just keywords</span>
          </h1>

          <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" }}>
            AI semantic analysis with full explainability for every hiring decision.
          </p>
        </div>

        {/* ── Score weights ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "32px",
        }}>
          {WEIGHTS.map(({ pct, label, color }) => (
            <div key={label} style={{
              padding: "16px 12px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}>
              <div className="font-mono" style={{ fontSize: "22px", fontWeight: 700, color, marginBottom: "4px" }}>
                {pct}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500, letterSpacing: "0.04em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Step 1: Job Description ── */}
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          marginBottom: "12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StepBadge n={1} />
              <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)" }}>Job Description</span>
            </div>
            <button
              type="button"
              onClick={() => { setTitle("Senior Frontend Engineer"); setJdText(DEMO_JD); }}
              style={{
                fontSize: "12px",
                color: "var(--text-2)",
                background: "transparent",
                border: "1px solid var(--border-md)",
                padding: "5px 12px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--border-hi)"; (e.target as HTMLButtonElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--border-md)"; (e.target as HTMLButtonElement).style.color = "var(--text-2)"; }}
            >
              Load Demo JD
            </button>
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Job title  (e.g. Senior Frontend Engineer)"
            style={{
              width: "100%",
              padding: "11px 14px",
              marginBottom: "10px",
              fontSize: "14px",
              background: "var(--bg3)",
              border: "1px solid var(--border-md)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border-md)")}
          />

          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={11}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: "14px",
              background: "var(--bg3)",
              border: "1px solid var(--border-md)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              outline: "none",
              resize: "none",
              lineHeight: "1.65",
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border-md)")}
          />
        </div>

        {/* ── Step 2: Threshold ── */}
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
            <StepBadge n={2} />
            <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)" }}>Shortlist Threshold</span>
          </div>

          {/* Slider + number */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "6px" }}>
            <div style={{ flex: 1 }}>
              <input
                type="range" min={40} max={90}
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
            <div className="font-mono" style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              width: "56px",
              textAlign: "right",
            }}>
              {threshold}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-3)" }}>40 — Lenient</span>
            <span style={{ fontSize: "11px", color: "var(--text-3)" }}>90 — Strict</span>
          </div>

          {/* Label pills */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              { label: "Shortlisted", range: tShortlist,  color: "var(--green)", bg: "var(--green-dim)", border: "rgba(16,185,129,0.2)" },
              { label: "Borderline",  range: tBorderline, color: "var(--amber)", bg: "var(--amber-dim)", border: "rgba(245,158,11,0.2)" },
              { label: "Rejected",    range: tRejected,   color: "var(--red)",   bg: "var(--red-dim)",   border: "rgba(239,68,68,0.2)"  },
            ].map(({ label, range, color, bg, border }) => (
              <div key={label} style={{
                padding: "12px",
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--radius)",
                textAlign: "center",
              }}>
                <div className="font-mono" style={{ fontSize: "14px", fontWeight: 700, color, marginBottom: "3px" }}>{range}</div>
                <div style={{ fontSize: "11px", color, opacity: 0.7, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        {loading ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "16px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "var(--radius-lg)",
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} className="dot-pulse" style={{
                width: "7px", height: "7px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
            <span style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 500 }}>
              Parsing job description with Claude AI…
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "14px",
              background: canSubmit ? "var(--accent)" : "var(--bg3)",
              color: canSubmit ? "#fff" : "var(--text-3)",
              border: `1px solid ${canSubmit ? "transparent" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => { if (canSubmit) (e.target as HTMLButtonElement).style.background = "#2563eb"; }}
            onMouseLeave={e => { if (canSubmit) (e.target as HTMLButtonElement).style.background = "var(--accent)"; }}
          >
            Create Job &amp; Analyze Candidates →
          </button>
        )}
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="font-mono" style={{
      width: "24px", height: "24px",
      borderRadius: "6px",
      background: "var(--accent)",
      color: "#fff",
      fontSize: "11px",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {n}
    </span>
  );
}