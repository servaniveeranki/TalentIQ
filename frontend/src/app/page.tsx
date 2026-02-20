"use client";

import { useState } from "react";
import UploadPage from "@/views/UploadPage";
import ResultsPage from "@/views/ResultsPage";
import { useJob } from "@/hooks/useJob";
import { useCandidates } from "@/hooks/useCandidates";

type View = "upload" | "results";

export default function Home() {
  const [view, setView] = useState<View>("upload");

  const { currentJob, loading: jobLoading, createJob, changeThreshold } = useJob();
  const {
    candidates, stats, processing, processingStatus,
    submitResume, submitResumeText, fetchCandidates,
  } = useCandidates(currentJob?._id);

  const handleJobCreated = async (title: string, content: string, threshold: number) => {
    const job = await createJob(title, content);
    await changeThreshold(job._id, threshold);
    setView("results");
    await fetchCandidates();
  };

  const handleThresholdChange = async (newThreshold: number) => {
    if (!currentJob) return;
    await changeThreshold(currentJob._id, newThreshold);
    await fetchCandidates();
  };

  const handleSubmitFiles = async (files: File[]) => {
    for (const file of files) await submitResume(file);
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--bg)",
      color: "var(--text)",
    }}>
      {/* ── Header ── */}
      <header style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        height: "52px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg2)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "var(--accent)",
            borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2"/>
              <circle cx="8" cy="8" r="2.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", color: "var(--text)" }}>
            TalentIQ
          </span>
          <span style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--accent)",
            background: "var(--accent-dim)",
            padding: "2px 7px",
            borderRadius: "4px",
            textTransform: "uppercase",
          }}>
            ATS
          </span>
        </div>

        {/* Nav hint */}
        <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
          AI-powered hiring intelligence
        </span>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        {view === "upload" ? (
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <UploadPage onJobCreated={handleJobCreated} loading={jobLoading} />
          </div>
        ) : currentJob ? (
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <ResultsPage
              job={currentJob}
              candidates={candidates}
              stats={stats}
              processing={processing}
              processingStatus={processingStatus}
              onSubmitFiles={handleSubmitFiles}
              onSubmitText={submitResumeText}
              onThresholdChange={handleThresholdChange}
              onBack={() => setView("upload")}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}