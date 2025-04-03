import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'bank_transfer', 'cash']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'cancelled', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: Object,
        required: true
    },
    completedAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema); 