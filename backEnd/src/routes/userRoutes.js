import express from "express";
import { register, login, updateProfile, authUser, getUserBookings, logoutUser,getPayments} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register); //ok
router.post('/login', login); //ok 
router.get('/auth-user', authMiddleware, authUser); // ok

router.post("/logout", authMiddleware, logoutUser); // 
router.patch("/update-profile", authMiddleware, updateProfile);
router.get("/bookings", authMiddleware, getUserBookings); // ok
router.get("/payment-methods", authMiddleware, getPayments); //ok

export default router;
