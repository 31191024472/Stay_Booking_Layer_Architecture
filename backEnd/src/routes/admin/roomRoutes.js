import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "../../controllers/admin/roomController.js";
import upload from "../../scripts/upload.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", upload.array("images", 5), createRoom); // Upload tối đa 5 ảnh
router.put("/:id", upload.array("images", 5), updateRoom);
router.delete("/:id", deleteRoom);

export default router;
