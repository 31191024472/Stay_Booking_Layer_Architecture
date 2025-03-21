import Hotel from '../models/Hotel.js';

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

export default {
    findAllHotels,
    findHotelByCode,
    createHotel,
    updateHotel,
    deleteHotel
};
