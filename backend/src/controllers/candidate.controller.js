import multer from "multer";
import Job from "../models/job.model.js";
import Candidate from "../models/candidate.model.js";
import { extractTextFromFile } from "../services/fileProcessing.service.js";
import { parseResume } from "../services/resumeIntelligence.service.js";
import { scoreCandidate } from "../services/matching.service.js";
import {
  computeFinalScore,
  assignLabel,
  buildCandidateResult,
} from "../services/ranking.service.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/errorHandler.js";

// Multer config — memory storage, max 5MB
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith(".txt") || file.originalname.endsWith(".pdf") || file.originalname.endsWith(".docx")) {
      cb(null, true);
    } else {
      cb(new AppError("Only .pdf, .docx, and .txt files are allowed", 400));
    }
  },
});

// POST /api/candidates/:jobId — single resume upload
export const submitCandidate = async (req, res) => {
  const job = await Job.findById(req.params.jobId).lean();
  if (!job) throw new AppError("Job not found", 404);

  let resumeText;

  // Accept either file upload or raw text in body
  if (req.file) {
    resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype, req.file.originalname);
  } else if (req.body.resumeText) {
    resumeText = req.body.resumeText;
  } else {
    throw new AppError("Provide a resume file or resumeText in the request body", 400);
  }

  // Pipeline: Parse → Score → Rank → Persist
  const resumeIntelligence = await parseResume(resumeText);
  const dimensionScores = await scoreCandidate(job.intelligence, resumeIntelligence);
  const finalScore = computeFinalScore(dimensionScores);
  const label = assignLabel(finalScore, job.threshold);
  const { scores, explanation } = buildCandidateResult(dimensionScores, finalScore, label);

  const candidate = await Candidate.create({
    jobId: job._id,
    name: req.body.candidateName || resumeIntelligence.candidateName,
    email: resumeIntelligence.email,
    phone: resumeIntelligence.phone,
    intelligence: {
      skills: resumeIntelligence.skills,
      totalExperienceYears: resumeIntelligence.totalExperienceYears,
      experienceEntries: resumeIntelligence.experienceEntries,
      projects: resumeIntelligence.projects,
      education: resumeIntelligence.education,
      certifications: resumeIntelligence.certifications,
    },
    scores,
    label,
    explanation,
  });

  // Increment candidate count on job
  await Job.findByIdAndUpdate(job._id, { $inc: { candidateCount: 1 } });

  sendSuccess(res, { candidate }, 201, "Resume analyzed successfully");
};

// POST /api/candidates/:jobId/bulk — multiple resumes
export const submitBulkCandidates = async (req, res) => {
  const job = await Job.findById(req.params.jobId).lean();
  if (!job) throw new AppError("Job not found", 404);

  if (!req.files || req.files.length === 0) {
    throw new AppError("No files uploaded", 400);
  }

  const results = [];

  for (const file of req.files) {
    try {
      const resumeText = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
      const resumeIntelligence = await parseResume(resumeText);
      const dimensionScores = await scoreCandidate(job.intelligence, resumeIntelligence);
      const finalScore = computeFinalScore(dimensionScores);
      const label = assignLabel(finalScore, job.threshold);
      const { scores, explanation } = buildCandidateResult(dimensionScores, finalScore, label);

      const candidate = await Candidate.create({
        jobId: job._id,
        name: resumeIntelligence.candidateName,
        email: resumeIntelligence.email,
        phone: resumeIntelligence.phone,
        intelligence: {
          skills: resumeIntelligence.skills,
          totalExperienceYears: resumeIntelligence.totalExperienceYears,
          experienceEntries: resumeIntelligence.experienceEntries,
          projects: resumeIntelligence.projects,
          education: resumeIntelligence.education,
          certifications: resumeIntelligence.certifications,
        },
        scores,
        label,
        explanation,
      });

      results.push({ file: file.originalname, success: true, candidateId: candidate._id });
    } catch (err) {
      results.push({ file: file.originalname, success: false, error: err.message });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  await Job.findByIdAndUpdate(job._id, { $inc: { candidateCount: successCount } });

  sendSuccess(res, { results, processed: results.length, success: successCount }, 201, "Bulk analysis complete");
};

// GET /api/candidates/:jobId — ranked list
export const getCandidates = async (req, res) => {
  const { label, minScore, maxScore, page = 1, limit = 50 } = req.query;
  const filter = { jobId: req.params.jobId };
  if (label) filter.label = label;
  if (minScore || maxScore) {
    filter["scores.final"] = {};
    if (minScore) filter["scores.final"].$gte = Number(minScore);
    if (maxScore) filter["scores.final"].$lte = Number(maxScore);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [candidates, total] = await Promise.all([
    Candidate.find(filter).sort({ "scores.final": -1 }).skip(skip).limit(Number(limit)).lean(),
    Candidate.countDocuments(filter),
  ]);

  const stats = await Candidate.aggregate([
    { $match: { jobId: candidates[0]?.jobId || req.params.jobId } },
    { $group: { _id: "$label", count: { $sum: 1 } } },
  ]);

  sendSuccess(res, {
    candidates,
    total,
    page: Number(page),
    stats: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
  });
};

// GET /api/candidates/:jobId/:candidateId — single detail
export const getCandidate = async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.candidateId,
    jobId: req.params.jobId,
  }).lean();
  if (!candidate) throw new AppError("Candidate not found", 404);
  sendSuccess(res, { candidate });
};

// DELETE /api/candidates/:jobId/:candidateId
export const deleteCandidate = async (req, res) => {
  const candidate = await Candidate.findOneAndDelete({
    _id: req.params.candidateId,
    jobId: req.params.jobId,
  });
  if (!candidate) throw new AppError("Candidate not found", 404);
  await Job.findByIdAndUpdate(req.params.jobId, { $inc: { candidateCount: -1 } });
  sendSuccess(res, null, 200, "Candidate deleted");
};