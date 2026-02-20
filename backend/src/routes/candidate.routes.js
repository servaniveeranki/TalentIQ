import { Router } from "express";
import {
  submitCandidate,
  submitBulkCandidates,
  getCandidates,
  getCandidate,
  deleteCandidate,
  upload,
} from "../controllers/candidate.controller.js";
import { asyncHandler } from "../utils/errorHandler.js";

const router = Router({ mergeParams: true }); // to access :jobId from parent

router.post("/", upload.single("resume"), asyncHandler(submitCandidate));
router.post("/bulk", upload.array("resumes", 20), asyncHandler(submitBulkCandidates));
router.get("/", asyncHandler(getCandidates));
router.get("/:candidateId", asyncHandler(getCandidate));
router.delete("/:candidateId", asyncHandler(deleteCandidate));

export default router;