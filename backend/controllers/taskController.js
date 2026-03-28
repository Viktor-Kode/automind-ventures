import Task from "../Model/TaskModel.js";

export const createTask = async (req, res, next) => {
    try {
        const taskData = {
            ...req.body,
            user: req.user._id
        };

        const task = new Task(taskData);
        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const { status, priority, category, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;
        
        // Build query
        const query = { user: req.user._id };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const tasks = await Task.find(query).sort(sort);

        res.json({
            count: tasks.length,
            tasks
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, user: req.user._id });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If status is being updated to completed, set completedAt
        if (updateData.status === "completed" && !updateData.completedAt) {
            updateData.completedAt = new Date();
        }

        // If status is changed from completed, clear completedAt
        if (updateData.status && updateData.status !== "completed") {
            updateData.completedAt = null;
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const stats = await Task.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalTasks = await Task.countDocuments({ user: userId });
        const completedTasks = stats.find(s => s._id === "completed")?.count || 0;
        const pendingTasks = stats.find(s => s._id === "pending")?.count || 0;
        const inProgressTasks = stats.find(s => s._id === "in-progress")?.count || 0;

        res.json({
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks
        });
    } catch (error) {
        next(error);
    }
};
