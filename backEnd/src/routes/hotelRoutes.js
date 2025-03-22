import express from 'express';
import { getHotels, getHotelByCode, createHotel, updateHotel, deleteHotel,getPopularDestinations
    ,getNearbyHotels, getAvailableCities, getHotelFilters} 
from '../controllers/hotelController.js';

const router = express.Router();

router.get('/popularDestinations', getPopularDestinations);
router.get('/nearbyHotels', getNearbyHotels);
router.get('/availableCities', getAvailableCities);
router.get('/', getHotels);
router.get('/verticalFilters', getHotelFilters)
router.get('/:hotelCode', getHotelByCode);
router.post('/', createHotel);
router.put('/:hotelCode', updateHotel);
router.delete('/:hotelCode', deleteHotel);

export default router;
