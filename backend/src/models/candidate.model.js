import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    skillMatch: { type: Number, min: 0, max: 100 },
    experience: { type: Number, min: 0, max: 100 },
    projects: { type: Number, min: 0, max: 100 },
    education: { type: Number, min: 0, max: 100 },
    final: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const explanationSchema = new mongoose.Schema(
  {
    skillReasoning: String,
    experienceReasoning: String,
    projectReasoning: String,
    educationReasoning: String,
    matchedSkills: [String],
    missingSkills: [String],
    strengths: [String],
    concerns: [String],
    summary: String,
  },
  { _id: false }
);

const candidateSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    // Privacy-first: only structured intelligence, NO raw resume
    intelligence: {
      skills: [String],
      totalExperienceYears: Number,
      experienceEntries: [
        {
          title: String,
          company: String,
          durationMonths: Number,
          technologies: [String],
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          impact: String,
        },
      ],
      education: [
        {
          degree: String,
          field: String,
          institution: String,
          year: Number,
        },
      ],
      certifications: [String],
    },
    scores: scoreSchema,
    label: {
      type: String,
      enum: ["shortlisted", "borderline", "rejected"],
      default: "rejected",
    },
    explanation: explanationSchema,
  },
  { timestamps: true }
);

candidateSchema.index({ jobId: 1, "scores.final": -1 });
candidateSchema.index({ jobId: 1, label: 1 });

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;