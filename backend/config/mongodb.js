import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/CollegeGO`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log connection success
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Event listeners for debugging
mongoose.connection.on("disconnected", () => console.log("⚠️ Database Disconnected"));
mongoose.connection.on("error", (err) => console.error("❌ Database Error:", err));

export default connectDB;
