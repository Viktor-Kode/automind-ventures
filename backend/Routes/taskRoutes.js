import express from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
} from "../controllers/taskController.js";
import { authenticate } from "../middleware/auth.js";

export const taskRoutes = express.Router();

// All task routes require authentication
taskRoutes.use(authenticate);

taskRoutes.post("/", createTask);
taskRoutes.get("/", getTasks);
taskRoutes.get("/stats", getTaskStats);
taskRoutes.get("/:id", getTaskById);
taskRoutes.put("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);
