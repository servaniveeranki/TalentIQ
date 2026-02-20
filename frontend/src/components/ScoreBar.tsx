"use client";

interface ScoreBarProps {
  label: string;
  score: number;
  color: string;
  weight?: string;
}

export default function ScoreBar({ label, score, color, weight }: ScoreBarProps) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {label}
          </span>
          {weight && (
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              color: "var(--text-3)",
              background: "var(--bg3)",
              padding: "1px 5px",
              borderRadius: "3px",
            }}>
              {weight}
            </span>
          )}
        </div>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "13px",
          fontWeight: 700,
          color,
        }}>
          {Math.round(score)}
        </span>
      </div>
      <div style={{ height: "3px", background: "var(--bg3)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${score}%`,
          background: `linear-gradient(90deg, ${color}50, ${color})`,
          borderRadius: "2px",
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}