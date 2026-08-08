import express from "express";
import {
  getGallery,
  addGalleryItem,
  editGalleryItem,
  removeGalleryItem,
} from "../controllers/galleryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", protectAdmin, addGalleryItem);
router.put("/:id", protectAdmin, editGalleryItem);
router.delete("/:id", protectAdmin, removeGalleryItem);

export default router;
