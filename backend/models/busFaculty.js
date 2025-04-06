const mongoose = require('mongoose');

const BusFacultySchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('BusFaculty', BusFacultySchema);