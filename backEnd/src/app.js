import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentTroutes.js';
import homeRoutes from './routes/homeRoutes.js';
import hotelRoutes from "./routes/hotelRoutes.js"
import miscRoutes from "./routes/miscRoutes.js"
// Config ExpressExpress
const app = express();
app.use(express.json());

// Config Cros
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Lấy đường dẫn tuyệt đối của thư mục hiện tại (vì ES Module không có __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình để phục vụ ảnh tĩnh từ thư mục public
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment-methods", paymentRoutes);
app.use("/api", homeRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/misc', miscRoutes);
export default app;
