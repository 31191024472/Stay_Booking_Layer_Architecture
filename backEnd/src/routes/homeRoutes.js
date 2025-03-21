import express from 'express';
import Destination from '../models/PopularDestination.js';
import Hotel from '../models/Hotel.js';
import City from '../models/City.js';

const router = express.Router();

// Lấy danh sách điểm đến phổ biến
router.get('/popularDestinations', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json({ errors: [], data: { elements: destinations } });
    } catch (error) {
        res.status(500).json({ errors: [error.message], data: { elements: [] } });
    }
});

// Lấy danh sách khách sạn gần vị trí cụ thể
router.get('/nearbyHotels', async (req, res) => {
    try {
        const { city } = req.query;
        const hotels = await Hotel.find(city ? { city } : {});
        res.json({ errors: [], data: { elements: hotels } });
    } catch (error) {
        res.status(500).json({ errors: [error.message], data: { elements: [] } });
    }
});

// Lấy danh sách các thành phố có sẵn
router.get('/availableCities', async (req, res) => {
    try {
        const cities = await City.find();
        res.json({ errors: [], data: { elements: cities.map(city => city.name) } });
    } catch (error) {
        res.status(500).json({ errors: [error.message], data: { elements: [] } });
    }
});

export default router;
