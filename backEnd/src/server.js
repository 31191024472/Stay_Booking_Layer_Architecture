import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config(); // Load biến môi trường từ .env

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
