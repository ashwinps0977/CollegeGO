import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Myticket1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    semester: "",
    bus: "",
    date: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleBookTicket = (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => value === "")) {
      alert("Please fill out all fields before booking.");
      return;
    }

    // Save ticket details to localStorage
    localStorage.setItem("ticketDetails", JSON.stringify(formData));

    // Redirect to Viewticket1 page
    navigate("/viewticket1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Bus Ticket Booking</h2>

        <form onSubmit={handleBookTicket} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-gray-700 font-semibold">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
              placeholder="Enter branch"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-gray-700 font-semibold">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
              placeholder="Enter semester"
            />
          </div>

          {/* Bus Route */}
          <div>
            <label className="block text-gray-700 font-semibold">Bus Route</label>
            <input
              type="text"
              name="bus"
              value={formData.bus}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
              placeholder="Enter bus route"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-semibold">Travel Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Book Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default Myticket1;
