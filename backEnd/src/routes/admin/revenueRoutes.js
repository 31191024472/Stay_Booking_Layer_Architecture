// routes/revenue.js
import express from "express";
import { getRevenueStatistics } from "../../controllers/admin/revenueController.js";

const router = express.Router();

// API Lấy thống kê doanh thu đặt phòng
router.get("/", getRevenueStatistics);

export default router;
