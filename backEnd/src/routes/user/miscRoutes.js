import express from "express";
import { getCountries } from "../../controllers/user/miscController.js";

const router = express.Router();

router.get("/countries", getCountries);

export default router;
