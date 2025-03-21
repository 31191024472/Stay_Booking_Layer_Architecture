import express from 'express';
import { getHotels, getHotelByCode, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/:hotelCode', getHotelByCode);
router.post('/', createHotel);
router.put('/:hotelCode', updateHotel);
router.delete('/:hotelCode', deleteHotel);

export default router;
