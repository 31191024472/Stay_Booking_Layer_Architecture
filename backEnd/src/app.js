import express from 'express';
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentTroutes.js';
import homeRoutes from './routes/homeRoutes.js';
import hotelRoutes from "./routes/hotelRoutes.js"

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
app.use("/api", homeRoutes);
app.use('/api/hotels', hotelRoutes);
export default app;
