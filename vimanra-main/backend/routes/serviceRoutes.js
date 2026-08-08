import express from "express";
import {
  getServices,
  addService,
  editService,
  removeService,
} from "../controllers/serviceController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", protectAdmin, addService);
router.put("/:id", protectAdmin, editService);
router.delete("/:id", protectAdmin, removeService);

export default router;
