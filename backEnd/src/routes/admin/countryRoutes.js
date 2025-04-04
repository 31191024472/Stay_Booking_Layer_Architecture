import express from "express";
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from "../../controllers/admin/countryController.js";

const router = express.Router();

router.get("/", getCountries); // Lấy danh sách quốc gia
router.get("/:id", getCountryById); // Lấy chi tiết một quốc gia
router.post("/", createCountry); // Thêm quốc gia mới
router.put("/:id", updateCountry); // Cập nhật quốc gia
router.delete("/:id", deleteCountry); // Xóa quốc gia

export default router;
