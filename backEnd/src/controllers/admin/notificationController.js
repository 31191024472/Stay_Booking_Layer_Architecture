import dotenv from "dotenv";
import multer from "multer";
import nodemailer from "nodemailer";
import User from "../../models/User.js"; // Đường dẫn đúng tới model User

dotenv.config();

const upload = multer();

export const sendPromotionalEmail = [
  upload.single("file"),
  async (req, res) => {
    const { subject, message } = req.body;
    const file = req.file;

    try {
      // Lấy danh sách tất cả email người dùng
      const users = await User.find({ role: "user" }, "email");

      const emailList = users.map((user) => user.email);

      if (emailList.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng nào có email",
        });
      }

      // Cấu hình transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Template email HTML đẹp
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #007BFF;">🎉 Ưu đãi đặc biệt từ StayBooking!</h2>
          <p>${message}</p>
          <a href="https://staybooking.com/uu-dai" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px;">Xem ngay ưu đãi</a>
          <br/><br/>
          <img src="https://cdn.pixabay.com/photo/2017/06/20/19/22/family-2421604_960_720.jpg" alt="Promotion" width="100%" style="margin-top: 20px; border-radius: 8px;" />
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailList, // <-- gửi đến tất cả user
        subject,
        html: emailTemplate,
        attachments: file
          ? [
              {
                filename: file.originalname,
                content: file.buffer,
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        message: `Email đã được gửi đến ${emailList.length} người dùng`,
      });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ success: false, message: "Lỗi gửi email" });
    }
  },
];
