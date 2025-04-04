import Hotel from "../../models/Hotel.js";
import hotelServices from "../../services/hotelServices.js";

// Lấy tất cả khách sạn
export const getHotels = async (req, res) => {
  try {
    const hotels = await hotelServices.getAllHotels();
    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy khách sạn theo hotelCode
export const getHotelByCode = async (req, res) => {
  try {
    const hotelCode = parseInt(req.params.hotelCode, 10);
    if (isNaN(hotelCode)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hotel code format" });
    }
    const hotel = await Hotel.findOne({ hotelCode: hotelCode });
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    res.json({ success: true, data: hotel });
  } catch (error) {
    console.error("❌ Error in getHotelByCode:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo khách sạn mới
export const createHotel = async (req, res) => {
  try {
    const hotel = await hotelServices.addHotel(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cập nhật khách sạn theo hotelCode
export const updateHotel = async (req, res) => {
  try {
    const hotelCode = parseInt(req.params.hotelCode, 10); // ✅ Chuyển hotelCode thành số

    if (isNaN(hotelCode)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hotel code format" });
    }

    const hotel = await hotelServices.editHotel(hotelCode, req.body);
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Xóa khách sạn theo hotelCode
export const deleteHotel = async (req, res) => {
  try {
    const hotelCode = parseInt(req.params.hotelCode, 10);

    if (isNaN(hotelCode)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hotel code format" });
    }

    const hotel = await hotelServices.removeHotel(hotelCode);
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNearbyHotels = async (req, res) => {
  try {
    const city = req.query.hotelCode || "1001";
    // console.log(`📌 Đang lấy khách sạn ở: ${city}`);

    const hotels = await hotelServices.getHotelsByCity(city);

    if (!hotels || hotels.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn nào." });
    }

    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("🚨 Lỗi khi lấy khách sạn gần nhất:", error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

export const getAvailableCities = async (req, res) => {
  try {
    const cities = await Hotel.distinct("hotelCode");
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getHotelFilters = async (req, res) => {
  try {
    const filters = await hotelServices.getFilters();
    res.status(200).json(filters);
  } catch (error) {
    console.error("Lỗi khi lấy bộ lọc khách sạn:", error);
    res.status(500).json({
      isLoading: false,
      data: null,
      errors: ["Internal Server Error"],
    });
  }
};

export const getPopularDestinations = async (req, res) => {
  try {
    const destinations = await hotelServices.getPopularDestinations();
    res.status(200).json({
      success: true,
      data: { elements: destinations },
    });
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};

//Lấy đánh gias khách sạn bằng hotel code
export const getHotelReview = async (req, res) => {
  try {
    let { hotelCode } = req.params;
    hotelCode = Number(hotelCode); // Vì bạn lưu hotelCode là dạng Number
    const { page = 1, limit = 5 } = req.query;

    // Lấy dữ liệu từ Service
    const reviewsResult = await hotelServices.getHotelReviews(hotelCode);

    // ✅ Tính averageRating
    const totalRating = reviewsResult.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      reviewsResult.reviews.length > 0
        ? (totalRating / reviewsResult.reviews.length).toFixed(1)
        : 0;

    // ✅ Tính starCounts
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsResult.reviews.forEach((review) => {
      const star = Math.floor(review.rating);
      if (starCounts[star] !== undefined) starCounts[star]++;
    });

    // ✅ Phân trang thủ công (vì Service trả hết để controller xử lý)
    const skip = (page - 1) * limit;
    const paginatedReviews = reviewsResult.reviews.slice(
      skip,
      skip + Number(limit)
    );

    // ✅ Trả đúng format frontend cần
    res.status(200).json({
      errors: [],
      data: {
        elements: paginatedReviews,
      },
      metadata: {
        totalReviews: reviewsResult.reviews.length,
        averageRating: Number(averageRating),
        starCounts,
        currentPage: Number(page),
        totalPages: Math.ceil(reviewsResult.reviews.length / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error getHotelReview:", err);
    res.status(500).json({ errors: [err.message] });
  }
};
