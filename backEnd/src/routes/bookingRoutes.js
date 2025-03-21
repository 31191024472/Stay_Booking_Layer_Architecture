import express from "express";
import { getUserBookings, createBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware, createBooking);
router.post("/",authMiddleware, getUserBookings);

export default router;
