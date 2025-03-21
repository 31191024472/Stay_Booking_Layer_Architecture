import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    hotelCode: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    ratings: { type: Number, required: true },
    benefits: [{ type: String }],
    images: [
        {
            imageUrl: { type: String },
            accessibleText: { type: String },
        }
    ],
    reviews: [
        {
            reviewerName: String,
            rating: Number,
            review: String,
            date: String,
            verified: Boolean
        }
    ]
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
