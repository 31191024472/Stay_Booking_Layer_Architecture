import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dii1s7a0c",
  api_key: "996819332359427",
  api_secret: "jzTScikCRTV6TZ6-eE5xGjsifiQ",
});

export default cloudinary;
