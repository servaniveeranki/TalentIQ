"use client";

interface CircleScoreProps {
  score: number;
  size?: number;
}

export default function CircleScore({ score, size = 80 }: CircleScoreProps) {
  const stroke   = Math.max(3, size * 0.055);
  const radius   = (size - stroke * 2) / 2;
  const circ     = 2 * Math.PI * radius;
  const offset   = circ - (score / 100) * circ;
  const color    = score >= 70 ? "var(--green)" : score >= 55 ? "var(--amber)" : "var(--red)";
  const trackClr = score >= 70
    ? "rgba(16,185,129,0.12)"
    : score >= 55 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={trackClr} strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      {/* Score text — single span, no duplicate className */}
      <span style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Geist Mono', monospace",
        fontSize: size * 0.24,
        fontWeight: 700,
        color,
        letterSpacing: "-0.02em",
      }}>
        {Math.round(score)}
      </span>
    </div>
  );
}