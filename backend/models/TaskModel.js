const mongoose = require('mongoose');

const taskSchema = new mongoose.Scheme({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
    },
    taskInfo: {
        type: String,
    },
    taskType: {
        type: true,
        required: true,
        enum: ["Daily", "Weekly", "History"],
        default: "Daily",
    },
    expireTime: {
        type: Date,
        required: [true, "Please provide an expiration time"],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);