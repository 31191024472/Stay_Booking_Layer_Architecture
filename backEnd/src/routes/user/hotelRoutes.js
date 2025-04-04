import express from "express";
import {
  createHotel,
  deleteHotel,
  getAvailableCities,
  getHotelByCode,
  getHotelFilters,
  getHotelReview,
  getHotels,
  getNearbyHotels,
  getPopularDestinations,
  updateHotel,
} from "../../controllers/user/hotelController.js";

const router = express.Router();

// ✅ Các API tĩnh hoặc không cần hotelCode
router.get("/nearbyHotels", getNearbyHotels);
router.get("/availableCities", getAvailableCities);
router.get("/popularDestinations", getPopularDestinations);
router.get("/verticalFilters", getHotelFilters);
router.get("/", getHotels);

// ✅ Các API dynamic liên quan đến hotelCode (chi tiết, review)
// Review phải đặt trước hotelCode
router.get("/:hotelCode/reviews", getHotelReview);
router.get("/:hotelCode", getHotelByCode);

// ✅ CRUD Hotel
router.post("/", createHotel);
router.put("/:hotelCode", updateHotel);
router.delete("/:hotelCode", deleteHotel);

export default router;
