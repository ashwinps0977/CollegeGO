// At the very top of your index.js
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const twilio = require('twilio');
const crypto = require('crypto'); // For password reset tokens

const User = require("./models/user");
const HOD = require("./models/hod");
const Warden = require("./models/warden");
const Request = require("./models/request");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/collegeGO");
const db = mongoose.connection;
db.once("open", () => console.log("✅ Connected to MongoDB"));

// Initialize Twilio client
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// REGISTER ROUTE
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      username,
      email,
      mobile,
      password: hashedPassword,
      branch,
      semester,
    });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  console.log(`🔍 Login attempt: Role=${role}, Username=${username}`);

  let Model;
  if (role === "HOD") Model = HOD;
  else if (role === "Student") Model = User;
  else if (role === "Warden") Model = Warden;
  else {
    return res.status(400).json({ error: "Invalid role selected" });
  }

  try {
    const user = await Model.findOne({ username });
    console.log(`🔎 Found user: ${user ? "Yes" : "No"}`);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let isMatch = false;
    if (role === "Student") {
      if (user.password.startsWith("$2b$")) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = password === user.password;
      }
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    let userData = { username: user.username, name: user.name };
    if (role === "Student") {
      userData.branch = user.branch;
      userData.semester = user.semester;
    }

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// HOD REQUESTS
app.get("/hodRequests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// APPROVED REQUESTS
app.get("/getApprovedRequestsHOD", async (req, res) => {
  try {
    const requests = await Request.find({ 
      status: "Approved",
      finalApproval: "Pending"
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching HOD-approved requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET USER BY USERNAME (Updated to exclude password)
app.get("/getUser/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Exclude password from response
    const { password, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE USER PROFILE
app.put("/updateUser/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { name, email, mobile } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { name, email, mobile },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ADD REQUEST
app.post("/addRequest", async (req, res) => {
  try {
    const { name, branch, semester, purpose, destination, date } = req.body;

    if (!name || !branch || !semester || !purpose || !destination || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newRequest = new Request({
      name,
      branch,
      semester,
      purpose,
      destination,
      date,
      status: "Pending",
      finalApproval: "Pending",
    });

    await newRequest.save();
    res.json({ message: "Request submitted successfully and forwarded to HOD!" });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE REQUEST STATUS
app.put("/updateRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Valid status ('Approved' or 'Rejected') is required" });
    }

    const updateData = { status };
    
    if (status === "Approved") {
      updateData.finalApproval = "Pending";
    } else if (status === "Rejected") {
      updateData.finalApproval = "Rejected";
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Request updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("❌ Error updating request status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// FINAL APPROVAL WITH NOTIFICATIONS AND SMS
app.put("/finalApproveRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notificationMessage } = req.body;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Valid action ('approve' or 'reject') is required" });
    }

    // Find the request
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Find the user
    const user = await User.findOne({ name: request.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate mobile number
    if (!user.mobile || !/^\d{10}$/.test(user.mobile)) {
      return res.status(400).json({ 
        error: "Invalid mobile number format",
        details: `Mobile number should be 10 digits, got: ${user.mobile}`
      });
    }

    // Update request status
    const requestUpdate = { 
      finalApproval: action === "approve" ? "Approved" : "Rejected"
    };
    const updatedRequest = await Request.findByIdAndUpdate(id, requestUpdate, { new: true });

    // Send SMS and add notification only for approval
    let smsResult = { sent: false, error: null };
    if (action === "approve") {
      try {
        const userUpdate = {
          $push: {
            notifications: {
              message: notificationMessage || "YOUR REQUEST HAS BEEN APPROVED - MAKE PAYMENT TO GRAB YOUR TICKET",
              type: "payment",
              requestId: request._id,
              createdAt: new Date()
            }
          }
        };
        await User.findOneAndUpdate(
          { name: request.name },
          userUpdate,
          { new: true }
        );

        // Send SMS notification
        const message = await twilioClient.messages.create({
          body: "YOUR REQUEST HAS BEEN APPROVED. MAKE PAYMENT TO GET YOUR BUS TICKET",
          to: `+91${user.mobile}`,
          from: process.env.TWILIO_PHONE_NUMBER
        });
        console.log(`✅ SMS sent to ${user.mobile}`, message.sid);
        smsResult.sent = true;
      } catch (smsError) {
        console.error("❌ Twilio Error:", {
          code: smsError.code,
          message: smsError.message,
          moreInfo: smsError.moreInfo
        });
        smsResult.error = {
          code: smsError.code,
          message: smsError.message
        };
      }
    }

    res.json({ 
      message: `Request ${action === "approve" ? "approved" : "rejected"} successfully`,
      request: updatedRequest,
      sms: smsResult
    });

  } catch (error) {
    console.error("❌ Server Error:", {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
  }
});

// PAYMENT ROUTE
app.post("/makePayment", async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Update request status to "Paid"
    await Request.findByIdAndUpdate(requestId, { paymentStatus: "Paid" });
    
    // Generate bus pass (you'll need to implement this)
    // await generateBusPass(requestId);
    
    res.json({ 
      success: true,
      message: "Payment successful. Bus pass generated."
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    let Model;
    if (role === "HOD") Model = HOD;
    else if (role === "Student") Model = User;
    else if (role === "Warden") Model = Warden;
    else {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    // Update user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // In production: Send email with this link
    const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}&role=${role}`;
    console.log(`Password reset link: ${resetLink}`);

    res.json({ 
      message: "Password reset link sent to your email",
      // Remove token in production - only for testing
      token: resetToken
    });
  } catch (error) {
    console.error("❌ Password reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword, role } = req.body;

    if (!token || !newPassword || !role) {
      return res.status(400).json({ error: "Token, new password and role are required" });
    }

    let Model;
    if (role === "HOD") Model = HOD;
    else if (role === "Student") Model = User;
    else if (role === "Warden") Model = Warden;
    else {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const user = await Model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash and update password
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Password reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// START SERVER
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