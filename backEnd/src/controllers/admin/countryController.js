import Country from "../../models/Country.js";

// Lấy danh sách tất cả quốc gia
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json({ success: true, countries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Lấy thông tin một quốc gia theo ID
export const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findById(id);
    if (!country) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy quốc gia" });
    }
    res.json({ success: true, country });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Tạo quốc gia mới
export const createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Kiểm tra quốc gia đã tồn tại chưa
    const existingCountry = await Country.findOne({ code });
    if (existingCountry) {
      return res
        .status(400)
        .json({ success: false, message: "Mã quốc gia đã tồn tại!" });
    }

    const newCountry = new Country({ name, code });
    await newCountry.save();

    res.status(201).json({
      success: true,
      message: "Tạo quốc gia thành công!",
      country: newCountry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Cập nhật quốc gia
export const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name, code },
      { new: true }
    );

    if (!updatedCountry) {
      return res
        .status(404)
        .json({ success: false, message: "Quốc gia không tồn tại" });
    }

    res.json({
      success: true,
      message: "Cập nhật quốc gia thành công",
      country: updatedCountry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Xóa quốc gia
export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res
        .status(404)
        .json({ success: false, message: "Quốc gia không tồn tại" });
    }

    res.json({ success: true, message: "Xóa quốc gia thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};
