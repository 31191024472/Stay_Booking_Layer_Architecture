import hotelRepository from '../repositories/hotelRepository.js';

const getAllHotels = async () => {
    return await hotelRepository.findAllHotels();
};

const getHotelByCode = async (hotelCode) => {
    return await hotelRepository.findHotelByCode(hotelCode);
};

const addHotel = async (hotelData) => {
    return await hotelRepository.createHotel(hotelData);
};

const editHotel = async (hotelCode, updatedData) => {
    return await hotelRepository.updateHotel(hotelCode, updatedData);
};

const removeHotel = async (hotelCode) => {
    return await hotelRepository.deleteHotel(hotelCode);
};

const getPopularDestinations = async () => {
  return await hotelRepository.fetchPopularDestinations();
};

const getHotelsByCity = async (city) => {
  try {
      return await hotelRepository.findHotelsByCity(city); 
  } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách khách sạn:", error);
      throw new Error("Lỗi khi lấy danh sách khách sạn từ database");
  }
};

const fetchAvailableCities = async () => {
    return await hotelRepository.getAvailableCities();
};

const getFilters = async () => {
    // Lấy dữ liệu từ repository
    const starRatings = await hotelRepository.getDistinctRatings();
    const propertyTypes = await hotelRepository.getDistinctPropertyTypes();
  
    return {
        isLoading: false,
        data: {
          elements: [
            {
              filterId: "star_ratings",
              title: "Star ratings",
              filters: starRatings.sort((a, b) => b - a).map((rating) => ({
                id: `${rating}_star_rating`,
                title: `${rating} Star`,
                value: rating.toString(),
              })),
            },
            {
              filterId: "property_type",
              title: "Property type",
              filters: propertyTypes.map((type) => ({
                id: `prop_type_${type.toLowerCase().replace(/\s+/g, "_")}`,
                title: type,
              })),
            },
          ],
        },
        errors: [],
      };
  };

  const getHotelReviews = async (hotelCode, page, limit) => {
    return await hotelRepository.fetchHotelReviews(hotelCode, page, limit);
  };

export default {
    getAllHotels,
    getHotelByCode,
    addHotel,
    editHotel,
    removeHotel,
    getPopularDestinations,
    getHotelsByCity,
    fetchAvailableCities,
    getFilters,
    getHotelReviews
};
