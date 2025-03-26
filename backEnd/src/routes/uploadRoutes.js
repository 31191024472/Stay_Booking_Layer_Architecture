import express from "express";
import multer from "multer";
import { uploadImageController } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ dest: "public/images/" }); // Lưu file tạm trước khi upload

// API Upload ảnh
router.post("/upload", upload.single("image"), uploadImageController);

export default router;
