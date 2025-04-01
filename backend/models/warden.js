const mongoose = require("mongoose");

const WardenSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Warden = mongoose.model("Warden", WardenSchema);
module.exports = Warden;
