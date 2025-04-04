import cloudinary from "../../config/cloudinary.js";
import Hotel from "../../models/Hotel.js";

// 📌 Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hotel_images" },
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

// 📌 Lấy danh sách tất cả khách sạn
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ hotels });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách khách sạn", error });
  }
};

// 📌 Tạo khách sạn mới (upload ảnh lên Cloudinary)
export const createHotel = async (req, res) => {
  try {
    const { hotelCode, title, propertyType, cityId, benefits } = req.body;

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.buffer))
    );

    const newHotel = new Hotel({
      hotelCode,
      title,
      propertyType,
      cityId,
      benefits: benefits ? benefits.split(",") : [],
      imageUrls,
    });

    await newHotel.save();
    res.status(201).json({ message: "Khách sạn đã được tạo", hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo khách sạn", error });
  }
};

// 📌 Cập nhật thông tin khách sạn
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.imageUrls = await Promise.all(
        req.files.map((file) => uploadImageToCloudinary(file.buffer))
      );
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedHotel) {
      return res.status(404).json({ message: "Không tìm thấy khách sạn" });
    }

    res
      .status(200)
      .json({ message: "Khách sạn đã được cập nhật", hotel: updatedHotel });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật khách sạn", error });
  }
};

// 📌 Xóa khách sạn
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return res.status(404).json({ message: "Không tìm thấy khách sạn" });
    }

    res.status(200).json({ message: "Khách sạn đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa khách sạn", error });
  }
};
