
//API for adding bus

import Doctor from "../models/busModel.js";

// API for adding a doctor
const addDoctor = async (req, res) => {
    try {
        // Extract bus details from request body
        const { name,routes,about,available, fees, address,date ,slot_booked } = req.body;

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor already exists" });
        }

        // Create new doctor
        const newDoctor = new Doctor({
            name,
            email,
            password, // Make sure to hash the password before saving!
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        });

        // Save to database
        await newDoctor.save();

        // Send success response
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });

    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { addDoctor };
