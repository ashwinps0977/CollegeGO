// At the very top of your index.js
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const twilio = require('twilio');
const crypto = require('crypto'); // For password reset tokens and verification codes

const User = require("./models/user");
const HOD = require("./models/hod");
const Warden = require("./models/warden");
const Request = require("./models/request");
const BusFaculty = require("./models/busFaculty");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/collegeGO", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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
  else if (role === "Bus-Faculty") Model = BusFaculty;
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

// GET USER REQUESTS (Updated with detailed status information)
app.get("/getUserRequests/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requests = await Request.find({ name: user.name }).sort({ createdAt: -1 });
    
    // Enhance each request with detailed status information
    const enhancedRequests = requests.map(request => {
      let statusDetails = {
        overallStatus: "Pending",
        hodStatus: request.status,
        wardenStatus: request.wardenApproval,
        paymentStatus: request.paymentStatus,
        isFullyApproved: request.finalApproval === "Approved",
        isRejected: request.finalApproval === "Rejected" || request.status === "Rejected",
        approvalDates: {
          hod: request.hodApprovalDate,
          warden: request.wardenApprovalDate
        }
      };

      // Determine overall status
      if (request.finalApproval === "Approved") {
        statusDetails.overallStatus = "Approved";
      } else if (request.finalApproval === "Rejected") {
        statusDetails.overallStatus = "Rejected by Warden";
      } else if (request.status === "Rejected") {
        statusDetails.overallStatus = "Rejected by HOD";
      } else if (request.status === "Approved" && request.finalApproval === "Pending") {
        statusDetails.overallStatus = "Pending Warden Approval";
      }

      return {
        ...request.toObject(),
        statusDetails
      };
    });

    res.json(enhancedRequests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET NOTIFICATIONS
app.get("/getNotifications/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Sort notifications by createdAt in descending order (newest first)
    const notifications = (user.notifications || []).sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Add additional metadata to each notification
    const enhancedNotifications = notifications.map(notification => {
      return {
        ...notification.toObject ? notification.toObject() : notification,
        isNew: notification.isNew !== false, // Default to true if not specified
        timestamp: notification.createdAt ? new Date(notification.createdAt).getTime() : Date.now()
      };
    });

    res.json(enhancedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
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
      wardenApproval: "Pending"
    });

    await newRequest.save();
    res.json({ message: "Request submitted successfully and forwarded to HOD!" });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE REQUEST STATUS (HOD Approval)
app.put("/updateRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: "Valid status ('Approved' or 'Rejected') is required" 
      });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ 
        success: false,
        error: "Request not found" 
      });
    }

    const updateData = { 
      status,
      hodApprovalDate: new Date()
    };
    
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

    // Add notification for student
    if (status === "Approved") {
      await User.findOneAndUpdate(
        { name: updatedRequest.name },
        {
          $push: {
            notifications: {
              message: `YOUR REQUEST HAS BEEN APPROVED BY HOD - ${updatedRequest.purpose.toUpperCase()} ON ${new Date(updatedRequest.date).toLocaleDateString()} - WAITING FOR WARDEN APPROVAL`,
              type: "status-update",
              requestId: updatedRequest._id,
              createdAt: new Date(),
              requestDetails: {
                purpose: updatedRequest.purpose,
                date: updatedRequest.date,
                destination: updatedRequest.destination,
                status: "HOD Approved"
              }
            }
          }
        }
      );
    }

    res.json({ 
      success: true,
      message: "Request updated successfully", 
      request: updatedRequest 
    });
  } catch (error) {
    console.error("❌ Error updating request status:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      details: error.message 
    });
  }
});

// FINAL APPROVAL WITH NOTIFICATIONS AND SMS (Warden Approval)
app.put("/finalApproveRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notificationMessage, requestData } = req.body;

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

    // Validate mobile number (only if we're approving and need to send SMS)
    if (action === "approve" && (!user.mobile || !/^\d{10}$/.test(user.mobile))) {
      return res.status(400).json({ 
        error: "Invalid mobile number format",
        details: `Mobile number should be 10 digits, got: ${user.mobile}`
      });
    }

    // Update request status
    const requestUpdate = { 
      finalApproval: action === "approve" ? "Approved" : "Rejected",
      wardenApproval: action === "approve" ? "Approved" : "Rejected",
      wardenApprovalDate: new Date()
    };
    const updatedRequest = await Request.findByIdAndUpdate(id, requestUpdate, { new: true });

    // Send SMS and add notification
    let smsResult = { sent: false, error: null };
    try {
      const notificationMsg = action === "approve" 
        ? `YOUR REQUEST HAS BEEN FULLY APPROVED - ${request.purpose.toUpperCase()} ON ${new Date(request.date).toLocaleDateString()} - HOD & WARDEN APPROVED - MAKE PAYMENT TO GRAB YOUR TICKET`
        : `YOUR REQUEST HAS BEEN REJECTED BY WARDEN - ${request.purpose.toUpperCase()} ON ${new Date(request.date).toLocaleDateString()}`;

      const userUpdate = {
        $push: {
          notifications: {
            message: notificationMessage || notificationMsg,
            type: action === "approve" ? "payment" : "status-update",
            requestId: request._id,
            createdAt: new Date(),
            requestDetails: requestData || {
              purpose: request.purpose,
              date: request.date,
              destination: request.destination,
              status: action === "approve" ? "Fully Approved" : "Rejected by Warden"
            }
          }
        }
      };
      
      // Update user with notification
      await User.findOneAndUpdate(
        { name: request.name },
        userUpdate,
        { new: true }
      );

      // Send SMS notification if approved
      if (action === "approve") {
        try {
          const message = await twilioClient.messages.create({
            body: notificationMessage || notificationMsg,
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
    } catch (error) {
      console.error("❌ Error adding notification:", error);
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

// PAYMENT ROUTE - Updated with more reliable verification code generation
app.post("/makePayment", async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Generate a unique ticket ID and 4-digit verification code
    const ticketId = crypto.randomBytes(8).toString('hex');
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit numeric code
    const timestamp = new Date();

    // Find and update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId, 
      { 
        paymentStatus: "Paid",
        ticketId,
        verificationCode,
        ticketGeneratedAt: timestamp
      },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Find the user who made the request
    const user = await User.findOne({ name: updatedRequest.name });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      success: true,
      message: "Payment successful. Bus pass generated.",
      ticketData: {
        name: user.name,
        department: user.branch,
        semester: user.semester,
        date: updatedRequest.date,
        purpose: updatedRequest.purpose,
        destination: updatedRequest.destination,
        ticketId,
        verificationCode,
        timestamp
      }
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// GET TICKET DATA BY TICKET ID (UPDATED)
app.get("/getTicket/:ticketId", async (req, res) => {
  try {
    const request = await Request.findOne({ 
      ticketId: req.params.ticketId,
      paymentStatus: "Paid"
    });
    
    if (!request) {
      return res.status(404).json({ error: "Ticket not found or payment not completed" });
    }

    const user = await User.findOne({ name: request.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      department: user.branch,
      semester: user.semester,
      date: request.date,
      purpose: request.purpose,
      destination: request.destination,
      ticketId: request.ticketId,
      verificationCode: request.verificationCode,
      timestamp: request.ticketGeneratedAt
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// VERIFY TICKET ROUTE
app.post("/verifyTicket", async (req, res) => {
  try {
    const { ticketId, verificationCode } = req.body;
    
    if (!ticketId || !verificationCode) {
      return res.status(400).json({ error: "Ticket ID and verification code are required" });
    }

    const request = await Request.findOne({ 
      ticketId,
      verificationCode,
      paymentStatus: "Paid"
    });

    if (!request) {
      return res.status(404).json({ 
        success: false,
        error: "Invalid ticket or verification code" 
      });
    }

    const user = await User.findOne({ name: request.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      success: true,
      message: "Ticket verified successfully",
      ticketData: {
        name: user.name,
        department: user.branch,
        semester: user.semester,
        date: request.date,
        purpose: request.purpose,
        destination: request.destination,
        ticketId: request.ticketId,
        verificationCode: request.verificationCode,
        timestamp: request.ticketGeneratedAt
      }
    });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    else if (role === "Bus-Faculty") Model = BusFaculty;
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
    else if (role === "Bus-Faculty") Model = BusFaculty;
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