"use client";

import { useState, useCallback } from "react";
import type { Candidate, CandidateStats } from "@/types";
import * as api from "@/services/api.service";

interface UseCandidatesReturn {
  candidates: Candidate[];
  stats: CandidateStats;
  loading: boolean;
  processing: boolean;
  processingStatus: string;
  error: string | null;
  fetchCandidates: (filters?: Record<string, unknown>) => Promise<void>;
  submitResume: (file: File, name?: string) => Promise<Candidate>;
  submitResumeText: (text: string, name: string) => Promise<Candidate>;
  submitBulk: (files: File[]) => Promise<void>;
  removeCandidate: (candidateId: string) => Promise<void>;
}

function extractMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "An unexpected error occurred";
}

export function useCandidates(jobId: string | undefined): UseCandidatesReturn {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<CandidateStats>({});
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(
    async (filters: Record<string, unknown> = {}) => {
      if (!jobId) return;
      setLoading(true);
      try {
        const res = await api.getCandidates(jobId, filters);
        setCandidates(res.data.candidates);
        setStats(res.data.stats ?? {});
      } catch (e) {
        setError(extractMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [jobId]
  );

  const submitResume = useCallback(
    async (file: File, name?: string): Promise<Candidate> => {
      if (!jobId) throw new Error("No job selected");
      setProcessing(true);
      setProcessingStatus(`Analyzing ${name ?? file.name}…`);
      try {
        const res = await api.submitResume(jobId, file, name);
        const candidate = res.data.candidate;
        setCandidates((prev) =>
          [candidate, ...prev].sort((a, b) => b.scores.final - a.scores.final)
        );
        setStats((prev) => ({
          ...prev,
          [candidate.label]: ((prev[candidate.label as keyof CandidateStats] as number) ?? 0) + 1,
        }));
        return candidate;
      } catch (e) {
        const msg = extractMessage(e);
        setError(msg);
        throw new Error(msg);
      } finally {
        setProcessing(false);
        setProcessingStatus("");
      }
    },
    [jobId]
  );

  const submitResumeText = useCallback(
    async (text: string, name: string): Promise<Candidate> => {
      if (!jobId) throw new Error("No job selected");
      setProcessing(true);
      setProcessingStatus(`Analyzing ${name}…`);
      try {
        const res = await api.submitResumeText(jobId, text, name);
        const candidate = res.data.candidate;
        setCandidates((prev) =>
          [candidate, ...prev].sort((a, b) => b.scores.final - a.scores.final)
        );
        return candidate;
      } catch (e) {
        const msg = extractMessage(e);
        setError(msg);
        throw new Error(msg);
      } finally {
        setProcessing(false);
        setProcessingStatus("");
      }
    },
    [jobId]
  );

  const submitBulk = useCallback(
    async (files: File[]) => {
      if (!jobId) throw new Error("No job selected");
      setProcessing(true);
      setProcessingStatus(`Processing ${files.length} resumes…`);
      try {
        await api.submitBulkResumes(jobId, files);
        await fetchCandidates();
      } catch (e) {
        const msg = extractMessage(e);
        setError(msg);
        throw new Error(msg);
      } finally {
        setProcessing(false);
        setProcessingStatus("");
      }
    },
    [jobId, fetchCandidates]
  );

  const removeCandidate = useCallback(
    async (candidateId: string) => {
      if (!jobId) return;
      try {
        await api.deleteCandidate(jobId, candidateId);
        setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      } catch (e) {
        setError(extractMessage(e));
      }
    },
    [jobId]
  );

  return {
    candidates, stats, loading, processing, processingStatus, error,
    fetchCandidates, submitResume, submitResumeText, submitBulk, removeCandidate,
  };
}