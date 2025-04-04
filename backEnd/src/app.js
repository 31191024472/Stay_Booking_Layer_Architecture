import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bookingRoutes from "./routes/admin/bookingRoutes.js";
import countryRoutes from "./routes/admin/countryRoutes.js";
import emailRoutes from "./routes/admin/notificationRoutes.js";
import revenueRoutes from "./routes/admin/revenueRoutes.js";
import roomRoutes from "./routes/admin/roomRoutes.js";
import userAdminRoutes from "./routes/admin/userRoutes.js";
import hotelRoutes from "./routes/user/hotelRoutes.js";
import miscRoutes from "./routes/user/miscRoutes.js";
import paymentRoutes from "./routes/user/paymentTroutes.js";
import uploadRoutes from "./routes/user/uploadRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";

// Config ExpressExpress
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config Cros
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Lấy đường dẫn tuyệt đối của thư mục hiện tại (vì ES Module không có __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình để phục vụ ảnh tĩnh từ thư mục public
app.use("/images", express.static(path.join(__dirname, "public/images")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment-methods", paymentRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/admin/revenue", revenueRoutes);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/admin/bookings", bookingRoutes);
app.use("/api/admin/countries", countryRoutes);
app.use("/api/admin/hotels", hotelRoutes);
app.use("/api/admin/rooms", roomRoutes);
app.use("/api/admin/email", emailRoutes);

// Upload imgs API
app.use("/api", uploadRoutes); // Định tuyến upload

export default app;
