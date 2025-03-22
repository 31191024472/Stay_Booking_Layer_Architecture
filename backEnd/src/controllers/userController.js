import userServices from "../services/userServices.js";
import dotenv from "dotenv";

dotenv.config();
export const register = async (req, res) => {
  try {
    const user = await userServices.register(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const token = await userServices.login(req.body.email, req.body.password);
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userServices.updateProfile(req.user.email, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Lấy thông tin user từ token
export const authUser = async (req, res) => {
  try {
      // Lấy user từ services bằng ObjectId từ MongoDB (_id)
      const user = await userServices.getAuthUser(req.user._id);
      console.log("🔹 Check function userService in userController:", user);

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
  } catch (error) {
      console.error("🚨 Lỗi trong authUser:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
      res.status(200).json({
          success: true,
          data: {
              status: "User logged out successfully"
          }
      });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getBookings = async(req, res)=>{
  try {
    const bookingData = await req.body;
    const booking = bookingService.confirmBooking(bookingData)

    res.status(200).json({
      success : true,
      data: {
        status: "Get Booking Confirm Success",
        bookingDetails: [
          { label: "Booking ID", value: booking.bookingId },
          { label: "Booking Date", value: booking.bookingDate },
          { label: "Hotel Name", value: booking.hotelName },
          { label: "Check-in Date", value: booking.checkInDate },
          { label: "Check-out Date", value: booking.checkOutDate },
          { label: "Total Fare", value: booking.totalFare }
      ]
      }
    });
  } catch (error) {
    res.status(500).json({success: false, message : "Server errors", error})
  }
}