const Task = require('../models/TaskModel');

// @desc Create a new Task
// @route POST /api/tasks
// @access Private
const createTask = async (req, res) => {
    try {
        const { title, taskInfo, taskType, expireTime } = req.body;

        if (!title || !taskInfo) return res.status(400).json({ success: false, error: "Please fill in all fields" });

        let calcuatedExpireTime;
        const now = new Date();

        if (taskType == 'Daily') {
            if (expireTime) {
                calcuatedExpireTime = expireTime;
            }
            else {
                calcuatedExpireTime = new Date(now);
                calcuatedExpireTime.setHours(23, 59, 59, 999);
            }
        }
        else {// Weekly task
            const daysTillSat = 6 - now.getDate();
            calcuatedExpireTime = new Date(now);
            calcuatedExpireTime.setDate(now.getDate() + daysTillSat);
            calcuatedExpireTime.setHours(23, 59, 59, 999);
        }

        const task = await Task.create({
            user: req.user._id,
            title,
            taskInfo,
            taskType: taskType || 'Daily',
            expireTime: calcuatedExpireTime,
        });

        res.status(201).json({ success: true, data: task })
    } catch (error) {
        console.error("Create Task Erro: ", error);
        res.status(500).json({ success: false, error: error.message });

    }
}

const getTasks = async (req, res) => {
    try {
        const now = new Date();

        // Finds all tasks that are pas their expiration and not in history
        const expiredTasks = await Task.find({
            user: req.user._id,
            expireTime: { $lt: now },
            taskType: { $ne: 'History' },
        });

        // Update all expired tasks to History
        if (expiredTasks.length > 0) {
            const expiredTasksIds = expiredTasks.map(task => task._id);
            await Task.updateMany(
                { _id: { $in: expiredTasksIds } },
                { $set: { taskType: 'History' } },
            )
        }

        const allTasks = await Task.find({
            user: req.user._id,
            taskType: {$ne: 'History'},
        }).sort({ expireTime: 1});

    } catch (error) {
        console.error("Create Task Erro: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createTask,
    getTasks,
    removeTask
}