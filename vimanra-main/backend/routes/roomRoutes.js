import express from "express";
import {
  getRooms,
  getRoom,
  editRoomPrice,
  editRoom,
  addRoom,
  removeRoom,
} from "../controllers/roomController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoom);
router.post("/", protectAdmin, addRoom);
router.put("/:id/price", protectAdmin, editRoomPrice);
router.put("/:id", protectAdmin, editRoom);
router.delete("/:id", protectAdmin, removeRoom);

export default router;
