import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  updateBooking,
} from "../../controllers/admin/bookingController.js";

const router = express.Router();

router.get("/", getBookings); // Lấy danh sách booking
router.get("/:id", getBookingById); // Lấy thông tin booking theo ID
router.post("/", createBooking); // Tạo booking mới
router.put("/:id", updateBooking); // Cập nhật booking
router.put("/:id/cancel", cancelBooking); // Hủy booking

export default router;
