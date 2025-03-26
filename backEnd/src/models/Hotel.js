import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  hotelCode: { type: Number, required: true, unique: true },  // Mã định danh riêng cho khách sạn
  title: { type: String, required: true },                   // Tên khách sạn
  subtitle: String,                                          // Mô tả ngắn hoặc địa chỉ
  description: String,                                       // Mô tả chi tiết về khách sạn
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }, // Tham chiếu đến City
  benefits: [String],                                        // Danh sách các tiện ích chung (free wifi, hồ bơi,...)
  ratings: Number,                                           // Điểm đánh giá trung bình
  imageUrls: [String],                                       // Mảng URL hình ảnh của khách sạn
  created_at: { type: Date, default: Date.now }              // Thời gian tạo
});

export default mongoose.model('Hotel', hotelSchema);
