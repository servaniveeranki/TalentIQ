"use client";

import { useState, useRef } from "react";
import CandidateCard from "@/components/CandidateCard";
import CandidateDetail from "@/components/CandidateDetail";
import DropZone from "@/components/DropZone";
import type { Candidate, CandidateStats, FilterLabel, Job } from "@/types";

interface ResultsPageProps {
  job: Job;
  candidates: Candidate[];
  stats: CandidateStats;
  processing: boolean;
  processingStatus: string;
  onSubmitFiles: (files: File[]) => Promise<void>;
  onSubmitText: (text: string, name: string) => Promise<void>;
  onThresholdChange: (threshold: number) => Promise<void>;
  onBack: () => void;
}

export default function ResultsPage({
  job, candidates, stats, processing, processingStatus,
  onSubmitFiles, onSubmitText, onThresholdChange, onBack,
}: ResultsPageProps) {
  const [selected, setSelected]         = useState<Candidate | null>(null);
  const [filterLabel, setFilterLabel]   = useState<FilterLabel>("all");
  const [showUpload, setShowUpload]     = useState(false);
  const [textInput, setTextInput]       = useState("");
  const [textName, setTextName]         = useState("");
  const [localThreshold, setLocalThreshold] = useState(job.threshold);
  const thresholdTimer = useRef<ReturnType<typeof setTimeout>>();

  const sorted   = [...candidates].sort((a, b) => b.scores.final - a.scores.final);
  const filtered = filterLabel === "all" ? sorted : sorted.filter(c => c.label === filterLabel);

  const handleFiles = async (files: File[]) => {
    setShowUpload(false);
    await onSubmitFiles(files);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    await onSubmitText(textInput, textName || "Candidate");
    setTextInput("");
    setTextName("");
  };

  const handleThresholdSlide = (value: number) => {
    setLocalThreshold(value);
    clearTimeout(thresholdTimer.current);
    thresholdTimer.current = setTimeout(() => onThresholdChange(value), 600);
  };

  const statItems: { key: FilterLabel; label: string; color: string; count: number }[] = [
    { key: "all",         label: "Total",       color: "var(--accent)", count: candidates.length },
    { key: "shortlisted", label: "Shortlisted", color: "var(--green)",  count: stats.shortlisted ?? 0 },
    { key: "borderline",  label: "Borderline",  color: "var(--amber)",  count: stats.borderline ?? 0 },
    { key: "rejected",    label: "Rejected",    color: "var(--red)",    count: stats.rejected ?? 0 },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Top bar ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "52px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg2)",
        gap: "16px",
      }}>
        {/* Left: back + job info */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontSize: "12px",
              color: "var(--text-2)",
              background: "transparent",
              border: "1px solid var(--border-md)",
              padding: "5px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = "var(--text)"; (e.target as HTMLButtonElement).style.borderColor = "var(--border-hi)"; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = "var(--text-2)"; (e.target as HTMLButtonElement).style.borderColor = "var(--border-md)"; }}
          >
            ← New Job
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {job.title}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "capitalize" }}>
              {job.intelligence.seniorityLevel} · {job.intelligence.domainContext}
            </div>
          </div>
        </div>

        {/* Right: threshold + add button */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
          <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Threshold</span>
          <input
            type="range" min={40} max={90}
            value={localThreshold}
            onChange={e => handleThresholdSlide(Number(e.target.value))}
            style={{ width: "100px", accentColor: "var(--accent)" }}
          />
          <span className="font-mono" style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent)", width: "28px", textAlign: "right" }}>
            {localThreshold}
          </span>
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            style={{
              padding: "6px 14px",
              background: showUpload ? "var(--bg3)" : "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!showUpload) (e.target as HTMLButtonElement).style.background = "#2563eb"; }}
            onMouseLeave={e => { if (!showUpload) (e.target as HTMLButtonElement).style.background = "var(--accent)"; }}
          >
            {showUpload ? "✕ Close" : "+ Add Resumes"}
          </button>
        </div>
      </div>

      {/* ── Upload drawer ── */}
      {showUpload && (
        <div style={{
          flexShrink: 0,
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg2)",
        }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <DropZone label="Drop resumes here" multiple onFiles={handleFiles} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                value={textName}
                onChange={e => setTextName(e.target.value)}
                placeholder="Candidate name"
                style={{
                  width: "100%", padding: "9px 12px", fontSize: "13px",
                  background: "var(--bg3)", border: "1px solid var(--border-md)",
                  borderRadius: "var(--radius)", color: "var(--text)", outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-md)")}
              />
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Or paste resume text here…"
                rows={4}
                style={{
                  width: "100%", padding: "9px 12px", fontSize: "13px",
                  background: "var(--bg3)", border: "1px solid var(--border-md)",
                  borderRadius: "var(--radius)", color: "var(--text)", outline: "none",
                  resize: "none", fontFamily: "inherit", lineHeight: 1.5,
                }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-md)")}
              />
              <button
                type="button"
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                style={{
                  padding: "8px 14px",
                  background: textInput.trim() ? "var(--accent)" : "var(--bg3)",
                  color: textInput.trim() ? "#fff" : "var(--text-3)",
                  border: "none", borderRadius: "var(--radius)",
                  fontSize: "12px", fontWeight: 600, fontFamily: "inherit",
                  cursor: textInput.trim() ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                Analyze Text →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{
        flexShrink: 0,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        borderBottom: "1px solid var(--border)",
        background: "var(--border)",
      }}>
        {statItems.map(({ key, label, color, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilterLabel(key)}
            style={{
              padding: "16px 20px",
              background: filterLabel === key ? "var(--bg3)" : "var(--bg2)",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
              transition: "background 0.15s",
              position: "relative",
            }}
          >
            {filterLabel === key && (
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "2px",
                background: color,
              }} />
            )}
            <div className="font-mono" style={{ fontSize: "26px", fontWeight: 700, color, lineHeight: 1, marginBottom: "4px" }}>
              {count}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: "1px", overflow: "hidden", background: "var(--border)" }}>

        {/* Candidate list */}
        <div style={{
          width: selected ? "420px" : "100%",
          flexShrink: selected ? 0 : undefined,
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          overflowY: "auto",
          background: "var(--bg)",
        }}>
          {/* Processing indicator */}
          {processing && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              background: "var(--accent-dim)",
              borderBottom: "1px solid rgba(59,130,246,0.15)",
              flexShrink: 0,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="dot-pulse" style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%", background: "var(--accent)", display: "inline-block",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
              <span style={{ fontSize: "12px", color: "var(--accent)" }}>{processingStatus}</span>
            </div>
          )}

          {/* List header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg2)",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-3)" }}>sorted by score</span>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: "13px" }}>
              {candidates.length === 0 ? "No candidates yet — add resumes to get started" : "No candidates match this filter"}
            </div>
          ) : (
            <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {filtered.map((c, i) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  rank={i + 1}
                  isSelected={selected?._id === c._id}
                  onClick={() => setSelected(selected?._id === c._id ? null : c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--bg)" }}>
            <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}