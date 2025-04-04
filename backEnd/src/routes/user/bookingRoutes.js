import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
} from "../../controllers/user/bookingController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, createBooking);
router.get("/", getUserBookings);
router.get("/all", getAllBookings);

export default router;
