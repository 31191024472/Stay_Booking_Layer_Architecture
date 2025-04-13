import roomRepository from "../repositories/adminRoomRespository.js";
import { uploadImageToCloudinary } from "../utils/cloudinaryHelper.js";

const getRooms = async () => {
  return await roomRepository.getAllRooms();
};

const getRoom = async (id) => {
  const room = await roomRepository.getRoomById(id);
  if (!room) throw new Error("Room not found");
  return room;
};

const createRoom = async (roomData, files) => {
  const imageUrls = await Promise.all(
    files.map((file) => uploadImageToCloudinary(file.buffer))
  );
  return await roomRepository.createRoom({ ...roomData, imageUrls });
};

const updateRoom = async (id, updateData, files) => {
  if (files.length > 0) {
    updateData.imageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer))
    );
  }
  const updatedRoom = await roomRepository.updateRoom(id, updateData);
  if (!updatedRoom) throw new Error("Room not found");
  return updatedRoom;
};

const deleteRoom = async (id) => {
  const deletedRoom = await roomRepository.deleteRoom(id);
  if (!deletedRoom) throw new Error("Room not found");
  return deletedRoom;
};

export default {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
