import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

export const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/profile", authenticate, getProfile);
