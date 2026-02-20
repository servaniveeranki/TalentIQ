import axios, { AxiosError, AxiosProgressEvent } from "axios";
import type {
  ApiResponse,
  Job,
  Candidate,
  CandidatesResponse,
  BulkResult,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 120_000,
});

// ── Response interceptor ───────────────────────────────────────────────────────
// Success: unwrap to res.data so callers get ApiResponse<T> directly
// Error:   reject with an Error whose .message is the backend's error string
api.interceptors.response.use(
  (res) => res.data as ApiResponse<unknown>,
  (err: AxiosError<{ error?: string; message?: string }>) => {
    const backendMsg =
      err.response?.data?.error ||   // { success: false, error: "..." }
      err.response?.data?.message ||  // fallback field
      err.message ||                  // axios network error
      "Unknown error";
    return Promise.reject(new Error(backendMsg));
  }
);

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const createJob = (title: string, content: string) =>
  api.post<never, ApiResponse<{ job: Job }>>("/api/jobs", { title, content });

export const listJobs = () =>
  api.get<never, ApiResponse<{ jobs: Job[]; total: number }>>("/api/jobs");

export const getJob = (jobId: string) =>
  api.get<never, ApiResponse<{ job: Job }>>(`/api/jobs/${jobId}`);

export const updateThreshold = (jobId: string, threshold: number) =>
  api.put<never, ApiResponse<{ job: Job; relabeled: number }>>(
    `/api/jobs/${jobId}/threshold`,
    { threshold }
  );

export const deleteJob = (jobId: string) =>
  api.delete<never, ApiResponse<null>>(`/api/jobs/${jobId}`);

// ─── Candidates ───────────────────────────────────────────────────────────────

export const submitResume = (jobId: string, file: File, candidateName?: string) => {
  const form = new FormData();
  form.append("resume", file);
  if (candidateName) form.append("candidateName", candidateName);
  return api.post<never, ApiResponse<{ candidate: Candidate }>>(
    `/api/candidates/${jobId}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const submitResumeText = (
  jobId: string,
  resumeText: string,
  candidateName?: string
) =>
  api.post<never, ApiResponse<{ candidate: Candidate }>>(
    `/api/candidates/${jobId}`,
    { resumeText, candidateName }
  );

export const submitBulkResumes = (
  jobId: string,
  files: File[],
  onProgress?: (e: AxiosProgressEvent) => void
) => {
  const form = new FormData();
  files.forEach((f) => form.append("resumes", f));
  return api.post<never, ApiResponse<{ results: BulkResult[]; processed: number; success: number }>>(
    `/api/candidates/${jobId}/bulk`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    }
  );
};

export const getCandidates = (
  jobId: string,
  params: {
    label?: string;
    minScore?: number;
    maxScore?: number;
    page?: number;
    limit?: number;
  } = {}
) =>
  api.get<never, ApiResponse<CandidatesResponse>>(
    `/api/candidates/${jobId}`,
    { params }
  );

export const getCandidate = (jobId: string, candidateId: string) =>
  api.get<never, ApiResponse<{ candidate: Candidate }>>(
    `/api/candidates/${jobId}/${candidateId}`
  );

export const deleteCandidate = (jobId: string, candidateId: string) =>
  api.delete<never, ApiResponse<null>>(
    `/api/candidates/${jobId}/${candidateId}`
  );