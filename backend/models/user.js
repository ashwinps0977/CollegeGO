const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  mobile: String,
  password: String,
  branch: String,
  semester: String,
});

module.exports = mongoose.model("User", userSchema);
