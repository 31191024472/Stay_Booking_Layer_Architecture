import Room from "../models/Room.js";

const getAllRooms = () => Room.find().populate("hotelId", "title");

const getRoomById = (id) => Room.findById(id).populate("hotelId", "title");

const createRoom = (roomData) => new Room(roomData).save();

const updateRoom = (id, updateData) =>
  Room.findByIdAndUpdate(id, updateData, { new: true });

const deleteRoom = (id) => Room.findByIdAndDelete(id);

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
