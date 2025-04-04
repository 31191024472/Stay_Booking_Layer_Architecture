import bcrypt from "bcryptjs"; // Thêm bcrypt để băm mật khẩu
import User from "../../models/User.js";

// Lấy danh sách user
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("countryId", "name")
      .select("-password"); // Không trả về password
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Thêm mới user
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      dateOfBirth,
      countryId,
    } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại!" });
    }

    // Băm mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Lưu mật khẩu đã băm
      phone,
      role,
      dateOfBirth,
      countryId,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "Tạo user thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Chỉnh sửa user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      dateOfBirth,
      password,
      countryId,
    } = req.body;

    // Nếu có mật khẩu mới, băm mật khẩu trước khi cập nhật
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      role,
      dateOfBirth,
      countryId,
    };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword; // Cập nhật mật khẩu đã băm
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("countryId", "name");

    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

    res.json({
      success: true,
      message: "Cập nhật user thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Xóa user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

    res.json({ success: true, message: "Xóa user thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};
