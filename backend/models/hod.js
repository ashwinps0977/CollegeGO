const mongoose = require("mongoose");

const HODSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const HOD = mongoose.model("HOD", HODSchema);
module.exports = HOD;
