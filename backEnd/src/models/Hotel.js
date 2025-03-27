import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  accessibleText: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  date: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const hotelSchema = new mongoose.Schema(
  {
    hotelCode: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    ratings: { type: Number, required: true, min: 0, max: 5 },
    benefits: [{ type: String }],
    images: [imageSchema],
    reviews: {
      data: [reviewSchema],
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
