"use client";

import { useState, useCallback } from "react";
import type { Job } from "@/types";
import * as api from "@/services/api.service";

interface UseJobReturn {
  jobs: Job[];
  currentJob: Job | null;
  setCurrentJob: React.Dispatch<React.SetStateAction<Job | null>>;
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  createJob: (title: string, content: string) => Promise<Job>;
  changeThreshold: (jobId: string, threshold: number) => Promise<void>;
}

/** Extract a human-readable message from anything thrown */
function extractMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "An unexpected error occurred";
}

export function useJob(): UseJobReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listJobs();
      setJobs(res.data.jobs);
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(async (title: string, content: string): Promise<Job> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.createJob(title, content);
      const job = res.data.job;
      setCurrentJob(job);
      setJobs((prev) => [job, ...prev]);
      return job;
    } catch (e) {
      const msg = extractMessage(e);
      console.error("Create Job Failed:", msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeThreshold = useCallback(async (jobId: string, threshold: number) => {
    try {
      await api.updateThreshold(jobId, threshold);
      setCurrentJob((prev) => (prev ? { ...prev, threshold } : prev));
    } catch (e) {
      const msg = extractMessage(e);
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return { jobs, currentJob, setCurrentJob, loading, error, fetchJobs, createJob, changeThreshold };
}