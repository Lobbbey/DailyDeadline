const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a user name"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('User', UserSchema);