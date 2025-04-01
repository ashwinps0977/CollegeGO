require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const HOD = require("./models/hod");
const Warden = require("./models/warden");
const Request = require("./models/request");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/collegeGO";

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ REGISTER ROUTE with password hashing
app.post("/register", async (req, res) => {
  try {
    const { name, username, email, mobile, password, branch, semester } = req.body;

    if (!name || !username || !email || !mobile || !password || !branch || !semester) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, mobile, password: hashedPassword, branch, semester });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ User Login with role-based authentication
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  console.log(`🔍 Login attempt: Role=${role}, Username=${username}`);

  const Model = role === "HOD" ? HOD : role === "Student" ? User : role === "Warden" ? Warden : null;
  if (!Model) return res.status(400).json({ error: "Invalid role selected" });

  try {
    const user = await Model.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = user.password.startsWith("$2b$") ? await bcrypt.compare(password, user.password) : password === user.password;
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    let userData = { username: user.username, name: user.name };
    if (role === "Student") Object.assign(userData, { branch: user.branch, semester: user.semester });

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Save request and forward to HOD
app.post("/addRequest", async (req, res) => {
  try {
    const { name, branch, semester, purpose, destination, date } = req.body;
    if (!name || !branch || !semester || !purpose || !destination || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newRequest = new Request({ name, branch, semester, purpose, destination, date, status: "Pending" });
    await newRequest.save();

    res.json({ message: "Request submitted successfully and forwarded to HOD!" });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API to update request status
app.put("/updateRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updatedRequest = await Request.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRequest) return res.status(404).json({ error: "Request not found" });

    res.json({ message: "Request updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("❌ Error updating request status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API to fetch all pending requests for HOD approval
app.get("/hodRequests", async (req, res) => {
  try {
    const requests = await Request.find({ status: "Pending" });
    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching HOD requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API to fetch only "Approved" requests for Warden
app.get("/getApprovedRequests", async (req, res) => {
  try {
    const approvedRequests = await Request.find({ status: "Approved" });
    res.json(approvedRequests);
  } catch (error) {
    console.error("❌ Error fetching approved requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please stop the existing process.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});