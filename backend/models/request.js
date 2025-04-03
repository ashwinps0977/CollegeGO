const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  purpose: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  finalApproval: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", RequestSchema);