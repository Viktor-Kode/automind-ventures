import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./Routes/authRoutes.js";
import { taskRoutes } from "./Routes/taskRoutes.js";
import { paymentRoutes } from "./Routes/paymentRoutes.js";
import { errorHandling } from "./middleware/errorHandling.js";

dotenv.config();

const app = express();

const frontendOrigin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (origin === frontendOrigin) return callback(null, true);
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        callback(null, false);
    },
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanager";

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Task Manager API is running", docs: "/api" });
});

app.get("/api", (req, res) => {
    res.json({
        auth: "/api/auth",
        tasks: "/api/tasks",
        payments: "/api/payments",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payments", paymentRoutes);

// Error handling middleware (must be last)
app.use(errorHandling);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
