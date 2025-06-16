import { Router } from "express";
import {
  createReview,
  listReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";

import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// Review routes with authentication & authorization
router.post("/", authenticate, authorize(["PATIENT"]), createReview);

router.get("/", authenticate, authorize(["ADMIN", "DOCTOR"]), listReviews);

router.get("/:id", authenticate, authorize(["ADMIN", "DOCTOR", "PATIENT"]), getReviewById);

router.put("/:id", authenticate, authorize(["PATIENT"]), updateReview);

router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteReview);

export default router;
