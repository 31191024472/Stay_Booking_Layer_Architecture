import cloudinary from "../../config/cloudinary.js";
import Room from "../../models/Room.js";

// 📌 Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "room_images" },
      (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload ảnh:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// 📌 Lấy danh sách phòng
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotelId", "title");
    res.json({ success: true, data: rooms });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách phòng", error });
  }
};

// 📌 Lấy thông tin phòng theo ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "hotelId",
      "title"
    );
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Phòng không tồn tại" });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy thông tin phòng", error });
  }
};

// 📌 Tạo phòng mới (Upload ảnh lên Cloudinary)
export const createRoom = async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      description,
      pricePerNight,
      maxOccupancy,
      bedType,
      amenities,
      totalRooms,
    } = req.body;

    // Upload ảnh lên Cloudinary
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.buffer))
    );

    const newRoom = new Room({
      hotelId,
      roomType,
      description,
      pricePerNight,
      maxOccupancy,
      bedType,
      amenities: amenities ? amenities.split(",") : [],
      totalRooms,
      availableRooms: totalRooms,
      imageUrls,
    });

    await newRoom.save();
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Lỗi khi tạo phòng", error });
  }
};

// 📌 Cập nhật phòng
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Nếu có ảnh mới, upload ảnh lên Cloudinary
    if (req.files.length > 0) {
      updateData.imageUrls = await Promise.all(
        req.files.map((file) => uploadImageToCloudinary(file.buffer))
      );
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRoom)
      return res
        .status(404)
        .json({ success: false, message: "Phòng không tồn tại" });

    res.json({ success: true, data: updatedRoom });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Lỗi khi cập nhật phòng", error });
  }
};

// 📌 Xóa phòng
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom)
      return res
        .status(404)
        .json({ success: false, message: "Phòng không tồn tại" });

    res.json({ success: true, message: "Đã xóa phòng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi xóa phòng", error });
  }
};
