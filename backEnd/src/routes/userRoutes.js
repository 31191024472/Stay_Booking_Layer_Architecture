import express from "express";
import { register, login, updateProfile, authUser, getBookings, logoutUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/update-profile', authMiddleware, updateProfile);
router.get('/auth-user', authMiddleware, authUser);
router.post("/logout", logoutUser);
router.get('bookings', authMiddleware, getBookings)

export default router;
