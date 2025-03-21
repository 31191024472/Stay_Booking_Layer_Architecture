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

const fetchPopularDestinations = async () => {
    return await hotelRepository.getPopularDestinations();
};

const fetchNearbyHotels = async (latitude, longitude) => {
    return await hotelRepository.getNearbyHotels(latitude, longitude);
};

const fetchAvailableCities = async () => {
    return await hotelRepository.getAvailableCities();
};
export default {
    getAllHotels,
    getHotelByCode,
    addHotel,
    editHotel,
    removeHotel,
    fetchPopularDestinations,
    fetchNearbyHotels,
    fetchAvailableCities
};
