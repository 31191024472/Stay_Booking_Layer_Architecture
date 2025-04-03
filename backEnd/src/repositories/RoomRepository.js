import Room from '../models/Room.js';

class RoomRepository {
  async findByHotelId(hotelId) {
    try {
      return await Room.find({ hotelId });
    } catch (error) {
      throw new Error(`Error finding rooms by hotel ID: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Room.findById(id);
    } catch (error) {
      throw new Error(`Error finding room by ID: ${error.message}`);
    }
  }

  async create(roomData) {
    try {
      const room = new Room(roomData);
      return await room.save();
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  async update(id, roomData) {
    try {
      return await Room.findByIdAndUpdate(id, roomData, { new: true });
    } catch (error) {
      throw new Error(`Error updating room: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Room.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting room: ${error.message}`);
    }
  }

  async checkAvailability(roomId, checkIn, checkOut) {
    try {
      // TODO: Implement availability check logic with bookings
      return true;
    } catch (error) {
      throw new Error(`Error checking room availability: ${error.message}`);
    }
  }
}

export default new  RoomRepository(); 