const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  mobile: String,
  password: String,
  branch: String,
  semester: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  notifications: [{
    message: String,
    type: String,
    requestId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("User", userSchema);