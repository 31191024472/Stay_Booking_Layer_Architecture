import hotelServices from "../services/hotelServices.js";
import Hotel from "../models/Hotel.js"; 
import PopularDestination from "../models/PopularDestination.js";

const BASE_URL = "http://localhost:5000";
// Lấy tất cả khách sạn
export const getHotels = async (req, res) => {
    try {
        const hotels = await hotelServices.getAllHotels();

        // Cập nhật URL ảnh đầy đủ
        const hotelsWithImages = hotels.map(hotel => ({
            ...hotel._doc,
            images: hotel.images.map(img => ({
                ...img,
                imageUrl: `${BASE_URL}${img.imageUrl}`
            }))
        }));

        res.json({ success: true, data: hotelsWithImages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy khách sạn theo hotelCode (chuyển hotelCode thành số)
export const getHotelByCode = async (req, res) => {
    try {
        const hotelCode = parseInt(req.params.hotelCode, 10);

        if (isNaN(hotelCode)) {
            return res.status(400).json({ success: false, message: "Invalid hotel code format" });
        }

        const hotel = await Hotel.findOne({ hotelCode: hotelCode });
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        // Cập nhật URL ảnh
        hotel.images = hotel.images.map(img => ({
            ...img,
            imageUrl: `${BASE_URL}${img.imageUrl}`
        }));

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
        const hotelCode = parseInt(req.params.hotelCode,10); // ✅ Chuyển hotelCode thành số

        if (isNaN(hotelCode)) {
            return res.status(400).json({ success: false, message: "Invalid hotel code format" });
        }

        const hotel = await hotelServices.editHotel(hotelCode, req.body);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa khách sạn theo hotelCode
export const deleteHotel = async (req, res) => {
    try {
        const hotelCode = parseInt(req.params.hotelCode,10); // ✅ Chuyển hotelCode thành số

        if (isNaN(hotelCode)) {
            return res.status(400).json({ success: false, message: "Invalid hotel code format" });
        }

        const hotel = await hotelServices.removeHotel(hotelCode);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.json({ success: true, message: "Hotel deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Lấy danh sách khách sạn phổ biến (rating >= 4.5)
 * @route GET /api/hotels/popularDestinations
 */
export const getPopularDestinations = async (req, res) => {
    try {
        const PopularDestinations = await PopularDestination.find();
        res.status(200).json({ success: true, data: PopularDestinations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


export const getNearbyHotels = async (req, res) => {
    try {
        const hotels = await Hotel.distinct("city");
        res.status(200).json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};  


export const getAvailableCities = async (req, res) => {
    try {
        const cities = await Hotel.distinct("city");
        res.status(200).json({ success: true, data: cities });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
