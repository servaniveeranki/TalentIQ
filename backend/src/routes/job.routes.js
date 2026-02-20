import { Router } from "express";
import {
  createJob,
  listJobs,
  getJob,
  updateThreshold,
  deleteJob,
} from "../controllers/job.controller.js";
import { asyncHandler } from "../utils/errorHandler.js";

const router = Router();

router.post("/", asyncHandler(createJob));
router.get("/", asyncHandler(listJobs));
router.get("/:id", asyncHandler(getJob));
router.put("/:id/threshold", asyncHandler(updateThreshold));
router.delete("/:id", asyncHandler(deleteJob));

export default router;