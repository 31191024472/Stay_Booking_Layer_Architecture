import cloudinary from "../config/cloudinary.js";

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

export default {uploadImageToCloudinary}