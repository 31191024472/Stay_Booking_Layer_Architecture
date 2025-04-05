import bookingRepository from "../repositories/adminRevenueRepository.js";

class RevenueService {
  async getRevenue(filter) {
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
      throw new Error("Invalid filter");
    }

    // Lấy dữ liệu booking đã xác nhận từ Repository
    const revenueData = await bookingRepository.getConfirmedBookings();

    // Tính toán tổng doanh thu theo groupFormat
    const aggregatedData = await Booking.aggregate([
      { $match: { status: "Confirmed" } },
      { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Định dạng dữ liệu
    return aggregatedData.map((entry) => {
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
  }
}

export default new RevenueService();
