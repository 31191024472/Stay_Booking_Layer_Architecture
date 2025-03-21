import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
});

export default mongoose.model('cities', CountrySchema);
