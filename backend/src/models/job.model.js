import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    rawContent: { type: String, required: true },
    intelligence: {
      roleTitle: String,
      seniorityLevel: { type: String, enum: ["junior", "mid", "senior", "lead", "principal", "any"] },
      requiredSkills: [String],
      preferredSkills: [String],
      experienceYearsMin: Number,
      experienceYearsMax: Number,
      educationRequirements: {
        degreeLevel: String,
        fields: [String],
      },
      domainContext: String,
      keyResponsibilities: [String],
    },
    threshold: { type: Number, default: 70, min: 0, max: 100 },
    candidateCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "closed", "draft"], default: "active" },
  },
  { timestamps: true }
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;