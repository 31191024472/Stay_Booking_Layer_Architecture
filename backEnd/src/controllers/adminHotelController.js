import * as hotelService from "../services/adminHotelService.js";

export const getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy danh sách khách sạn", error });
  }
};

export const createHotel = async (req, res) => {
  try {
    const newHotel = await hotelService.createHotel(req.body, req.files);
    res
      .status(201)
      .json({
        success: true,
        message: "Khách sạn đã được tạo",
        hotel: newHotel,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi tạo khách sạn", error });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await hotelService.updateHotel(
      req.params.id,
      req.body,
      req.files
    );
    if (!updatedHotel) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Khách sạn đã được cập nhật",
        hotel: updatedHotel,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật khách sạn", error });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await hotelService.deleteHotel(req.params.id);
    if (!deletedHotel) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn" });
    }
    res.status(200).json({ success: true, message: "Khách sạn đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi xóa khách sạn", error });
  }
};
