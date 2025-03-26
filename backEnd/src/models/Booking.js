import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // Người đặt
  hotelCode: { type: Number, required: true },                                    // Khách sạn
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },  // Loại phòng
  
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  
  quantity: { type: Number, default: 1 },       // Số lượng phòng đặt
  totalPrice: { type: Number, required: true }, // Tổng tiền

  paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }, // Phương thức thanh toán

  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }, // Trạng thái
  source: { type: String, enum: ['web', 'app', 'reception'], default: 'web' }, // Đặt qua đâu
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
