import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    code: Number,
    name: String,
    imageUrl: String,
});

export default mongoose.model('Destination', destinationSchema);
