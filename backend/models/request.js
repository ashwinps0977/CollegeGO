const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  branch: String,
  semester: String,
  purpose: String,
  destination: String,
  date: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Request", requestSchema);
