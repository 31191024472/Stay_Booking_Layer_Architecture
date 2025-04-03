# Stay Booker Pro

Stay Booker Pro là một nền tảng đặt phòng khách sạn trực tuyến, cho phép người dùng tìm kiếm, đặt phòng, thanh toán trực tuyến và quản lý đặt chỗ một cách dễ dàng.

## Công nghệ sử dụng
### **Frontend:**
- **React.js**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **React Router**: Quản lý điều hướng trang.
- **Tailwind CSS**: Thiết kế giao diện nhanh chóng và linh hoạt.
- **Formik & Yup**: Hỗ trợ xử lý form và xác thực dữ liệu.
- **MirageJS**: Mô phỏng API trong quá trình phát triển.
- **React Image Gallery**: Hiển thị hình ảnh khách sạn.
- **Date-fns**: Xử lý thời gian và ngày tháng.
- **React Select**: Dropdown UI.
- **React-to-Print**: In hóa đơn.

### **Backend:**
- **Node.js & Express.js**: Xây dựng API RESTful.
- **MongoDB**: Lưu trữ dữ liệu khách sạn, phòng và người dùng.
- **Sequelize & MSSQL**: Quản lý cơ sở dữ liệu SQL cho một số chức năng.
- **Mongoose**: Quản lý cơ sở dữ liệu MongoDB.
- **JWT (jsonwebtoken)**: Xác thực người dùng.
- **Cloudinary**: Lưu trữ và quản lý ảnh khách sạn.
- **Nodemailer**: Gửi email xác nhận đặt phòng.
- **Multer**: Upload hình ảnh.
- **Express Validator**: Kiểm tra và xác thực dữ liệu đầu vào.
- **bcrypt**: Mã hóa mật khẩu.
- **CORS**: Cho phép truy cập API từ các domain khác nhau.

## Cài đặt và chạy ứng dụng

### 1. Cài đặt Backend
#### **Yêu cầu**
- Node.js (>=16)
- MongoDB

#### **Bước 1: Clone repository**
```bash
git clone https://github.com/31191024472/Stay_Booking_Layer_Architecture

```

#### **Bước 2: Cài đặt dependencies**

```bash
cd /backend
npm install
```

#### **Bước 3: Thiết lập biến môi trường**
Tạo file `.env` và điền các thông tin cần thiết:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/DB_Stay_Booking
JWT_SECRET=superstrongsecret123!

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### **Bước 4: Chạy database seed để import dữ liệu vào database dữ liệu**
```bash
npm run db:seed
```

#### **Bước 5: Khởi động backend**
```bash
npm run dev
```
API sẽ chạy tại `http://localhost:5000`.

---
### 2. Cài đặt Frontend
#### **Bước 1: Chuyển vào thư mục frontend**
```bash
cd ../frontend
```

#### **Bước 2: Cài đặt dependencies**
```bash
npm install
```

#### **Bước 3: Khởi động frontend**
```bash
npm start
```
Ứng dụng sẽ chạy tại `http://localhost:3000`.

## Tính năng chính
✅ Tìm kiếm khách sạn theo đánh giá sao, thành phố và loại khách sạn (type)
✅ Xem chi tiết khách sạn và đặt phòng
✅ Thanh toán online
✅ Quản lý đặt phòng
✅ Đánh giá khách sạn
✅ Hệ thống thông báo đặt phòng qua email



