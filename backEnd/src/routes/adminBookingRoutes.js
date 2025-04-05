import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
} from "../controllers/adminBookingController.js";

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id/cancel", cancelBooking);

export default router;
