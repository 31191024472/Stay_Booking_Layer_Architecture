import Hotel from '../models/Hotel.js';
import popularDestinations from "../models/PopularDestination.js"

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

const getPopularDestinations = async () => {
    return await popularDestinations.find();
};

const getNearbyHotels = async () => {
    return await Hotel.find(city ? { city } : {});
};

const getAvailableCities = async () => {
    return await Hotel.distinct("city");
};

const getDistinctRatings = async () => {
    return await Hotel.distinct("ratings");
  };
  
const getDistinctPropertyTypes = async () => {
    return await Hotel.distinct("title");
  };


export default {
    findAllHotels,
    findHotelByCode,
    createHotel,
    updateHotel,
    deleteHotel,
    getPopularDestinations,
    getNearbyHotels,
    getAvailableCities,
    getDistinctRatings,
    getDistinctPropertyTypes

};
