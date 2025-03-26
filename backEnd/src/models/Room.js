import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Tham chiếu khách sạn chứa phòng này
  roomType: { type: String, required: true },       // Loại phòng: Deluxe, Suite, Standard
  description: String,                              // Mô tả chi tiết về phòng
  pricePerNight: { type: Number, required: true },  // ✅ Giá phòng mỗi đêm (quan trọng)
  maxOccupancy: Number,                             // Số người tối đa
  bedType: String,                                  // Loại giường: King, Queen, Twin
  amenities: [String],                              // Danh sách tiện ích trong phòng
  quantity: { type: Number, default: 1 },           // Tổng số lượng phòng loại này trong khách sạn
  imageUrls: [String]                               // ✅ Mảng URL hình ảnh của phòng
});

export default mongoose.model('Room', roomSchema);
