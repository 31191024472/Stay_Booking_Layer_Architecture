// routes/admin/emailRoutes.js
import express from "express";
import { sendPromotionalEmail } from "../../controllers/admin/notificationController.js";

const router = express.Router();

router.post("/send", sendPromotionalEmail);

export default router;
