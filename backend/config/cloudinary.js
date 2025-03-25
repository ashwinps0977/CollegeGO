import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectCloudinary = async () => {
    cloudinary.config({  // ❌ Removed cloudinary.v2.config()
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
    console.log("✅ Cloudinary connected successfully!");
};

export default connectCloudinary;

