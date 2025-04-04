// controllers/revenueController.js
import Booking from "../../models/Booking.js";

export const getRevenueStatistics = async (req, res) => {
  try {
    const { filter } = req.query;

    // Xác định cách nhóm theo thời gian
    let groupFormat;
    if (filter === "day") {
      groupFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (filter === "month") {
      groupFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else if (filter === "year") {
      groupFormat = { year: { $year: "$createdAt" } };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid filter" });
    }

    // Truy vấn doanh thu từ MongoDB
    const revenueData = await Booking.aggregate([
      { $match: { status: "Confirmed" } }, // Chỉ lấy booking đã xác nhận
      { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Định dạng dữ liệu nếu cần
    const formattedRevenueData = revenueData.map((entry) => {
      let label = "";
      if (filter === "day") {
        label = `${entry._id.day}-${entry._id.month}-${entry._id.year}`;
      } else if (filter === "month") {
        label = `${entry._id.month}-${entry._id.year}`;
      } else if (filter === "year") {
        label = `${entry._id.year}`;
      }

      return { ...entry, label };
    });

    res.json({ success: true, revenueData: formattedRevenueData });
  } catch (error) {
    console.error("Lỗi thống kê doanh thu:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ", error });
  }
};
