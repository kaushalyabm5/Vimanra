import express from "express";
import {
  getReviews,
  addReview,
  editReview,
  removeReview,
} from "../controllers/reviewController.js";
import { protectAdmin, optionalAdmin, identifyReviewSource } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAdmin, getReviews);
router.post("/", identifyReviewSource, addReview);
router.put("/:id", protectAdmin, editReview);
router.delete("/:id", protectAdmin, removeReview);

export default router;
