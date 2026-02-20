import Job from "../models/job.model.js";
import Candidate from "../models/candidate.model.js";
import { parseJobDescription } from "../services/jdIntelligence.service.js";
import { assignLabel } from "../services/ranking.service.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/errorHandler.js";

// POST /api/jobs
export const createJob = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new AppError("title and content are required", 400);

  const intelligence = await parseJobDescription(content);

  const job = await Job.create({
    title,
    rawContent: content,
    intelligence,
  });

  sendSuccess(res, { job }, 201, "Job created and analyzed successfully");
};

// GET /api/jobs
export const listJobs = async (req, res) => {
  const jobs = await Job.find({ status: "active" })
    .sort({ createdAt: -1 })
    .select("-rawContent")
    .lean();
  sendSuccess(res, { jobs, total: jobs.length });
};

// GET /api/jobs/:id
export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).lean();
  if (!job) throw new AppError("Job not found", 404);
  sendSuccess(res, { job });
};

// PUT /api/jobs/:id/threshold
export const updateThreshold = async (req, res) => {
  const { threshold } = req.body;
  if (threshold === undefined || threshold < 0 || threshold > 100) {
    throw new AppError("threshold must be a number between 0 and 100", 400);
  }

  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { threshold },
    { new: true, runValidators: true }
  ).lean();
  if (!job) throw new AppError("Job not found", 404);

  // Bulk re-label all candidates for this job
  const candidates = await Candidate.find({ jobId: req.params.id });
  const bulkOps = candidates.map((c) => ({
    updateOne: {
      filter: { _id: c._id },
      update: { label: assignLabel(c.scores.final, threshold) },
    },
  }));
  if (bulkOps.length) await Candidate.bulkWrite(bulkOps);

  sendSuccess(res, { job, relabeled: bulkOps.length }, 200, "Threshold updated");
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { status: "closed" }, { new: true });
  if (!job) throw new AppError("Job not found", 404);
  sendSuccess(res, null, 200, "Job closed");
};