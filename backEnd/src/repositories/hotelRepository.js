import Hotel from '../models/Hotel.js';
import City from '../models/City.js';
import Review from '../models/Review.js';

const findAllHotels = async () => {
    return await Hotel.find();
};

const findHotelByCode = async (hotelCode) => {
    return await Hotel.findOne({ hotelCode });
};

const createHotel = async (hotelData) => {
    return await Hotel.create(hotelData);
};

const updateHotel = async (hotelCode, updatedData) => {
    return await Hotel.findOneAndUpdate({ hotelCode }, updatedData, { new: true });
};

const deleteHotel = async (hotelCode) => {
    return await Hotel.findOneAndDelete({ hotelCode });
};

const findHotelsByCity = async (city) => {
    try {
        return await Hotel.find({ hotelCode: city.toLowerCase() }); 
    } catch (error) {
        console.error("❌ Lỗi khi truy vấn MongoDB:", error);
        throw new Error("Không thể lấy dữ liệu khách sạn");
    }
};

const getAvailableCities = async () => {
    return await Hotel.distinct("hotelCode");
};
const fetchPopularDestinations = async () => {
    const destinations = await City.find().limit(5);
    // console.log(destinations); // Kiểm tra dữ liệu lấy từ MongoDB
    return destinations; 
 
  };

const getDistinctRatings = async () => {
    return await Hotel.distinct("ratings");
  };
  
const getDistinctPropertyTypes = async () => {
    return await Hotel.distinct("title");
  };

const fetchHotelReviews = async (hotelCode, page, limit) => {
    // ✅ Tìm hotel theo hotelCode
    const hotel = await Hotel.findOne({ hotelCode: Number(hotelCode) });
    // console.log("Check data response in repositoryHotel:", hotel)
    if (!hotel) throw new Error("Hotel not found");
  
    const skip = (page - 1) * limit;
  
    // ✅ Query review theo hotelId, phân trang
    const [reviews, total] = await Promise.all([
      Review.find({ hotelId: hotel._id })
        .skip(skip)
        .limit(Number(limit))
        .sort({ date: -1 }),
      Review.countDocuments({ hotelId: hotel._id })
    ]);
  
    return { reviews, total };
  };

export default {
    findAllHotels,
    findHotelByCode,
    createHotel,
    updateHotel,
    deleteHotel,
    findHotelsByCity,
    getAvailableCities,
    getDistinctRatings,
    getDistinctPropertyTypes,
    fetchPopularDestinations,
    fetchHotelReviews 

};
