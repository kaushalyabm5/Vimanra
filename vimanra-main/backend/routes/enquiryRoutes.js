import express from "express";
import { addEnquiry, getEnquiries, editEnquiry } from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", addEnquiry);
router.get("/", protectAdmin, getEnquiries);
router.put("/:id", protectAdmin, editEnquiry);

export default router;
