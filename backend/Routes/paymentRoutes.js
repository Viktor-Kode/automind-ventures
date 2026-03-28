import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    getPublicConfig,
    initializePayment,
    verifyPayment,
    flutterwaveWebhook,
} from "../controllers/paymentController.js";

export const paymentRoutes = express.Router();

paymentRoutes.get("/config", getPublicConfig);
paymentRoutes.post("/initialize", authenticate, initializePayment);
paymentRoutes.get("/verify", authenticate, verifyPayment);
paymentRoutes.post("/webhook", flutterwaveWebhook);
