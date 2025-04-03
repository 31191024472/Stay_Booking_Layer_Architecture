import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRouter.js';
import hotelRoutes from "./routes/hotelRoutes.js"
import miscRoutes from "./routes/miscRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"

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


// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment-methods", paymentRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/rooms', roomRoutes);

// Upload imgs API
app.use('/api', uploadRoutes); // Định tuyến upload

export default app;
