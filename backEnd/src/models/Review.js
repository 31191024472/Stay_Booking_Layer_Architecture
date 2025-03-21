import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  hotelCode: { type: Number, required: true },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

export default mongoose.model('Review', ReviewSchema);
