import User from '../models/User.js';

const findByEmail = (email) => User.findOne({ email });
const createUser = (userData) => User.create(userData);
const updateUser = (email, updateData) => User.findOneAndUpdate({ email }, updateData, { new: true });

export default { findByEmail, createUser, updateUser };
