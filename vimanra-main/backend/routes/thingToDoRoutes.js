import express from "express";
import {
  getThingsToDo,
  addThingToDo,
  editThingToDo,
  removeThingToDo,
} from "../controllers/thingToDoController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getThingsToDo);
router.post("/", protectAdmin, addThingToDo);
router.put("/:id", protectAdmin, editThingToDo);
router.delete("/:id", protectAdmin, removeThingToDo);

export default router;
