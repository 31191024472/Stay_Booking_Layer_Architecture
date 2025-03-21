import hotelServices from '../services/hotelServices.js';

export const getHotels = async (req, res) => {
    try {
        const hotels = await hotelServices.getAllHotels();
        res.json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHotelByCode = async (req, res) => {
    try {
        const hotel = await hotelServices.getHotelByCode(req.params.hotelCode);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createHotel = async (req, res) => {
    try {
        const hotel = await hotelServices.addHotel(req.body);
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const hotel = await hotelServices.editHotel(req.params.hotelCode, req.body);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const hotel = await hotelServices.removeHotel(req.params.hotelCode);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, message: 'Hotel deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
