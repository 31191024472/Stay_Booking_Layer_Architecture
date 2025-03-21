import userServices from "../services/userServices.js";
import dotenv from "dotenv";

dotenv.config();
export const register = async (req, res) => {
  try {
    const user = await userServices.register(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const token = await userServices.login(req.body.email, req.body.password);
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userServices.updateProfile(req.user.email, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const authUser = (req, res) => {
  res.json({ success: true, user: req.user });
};