import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Request1 = () => {
  const navigate = useNavigate();

  // Branch and Semester options
  const branches = ["CS", "MECH", "AD", "CY", "EC", "EEE", "ECS", "CIVIL"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  // State for form inputs
  const [request, setRequest] = useState({
    name: "",
    branch: "",
    semester: "",
    purpose: "",
    destination: "",
    date: "",
    status: "Pending", // Default status
  });

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["name", "purpose", "destination"].includes(name)) {
      const validFormat = /^[A-Za-z ]*$/; // Only letters and spaces allowed
      if (!validFormat.test(value)) return;
    }
    setRequest({ ...request, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new request with a unique ID
    const newRequest = { id: Date.now(), ...request };

    // Save only the new request, removing previous ones
    localStorage.setItem("wardenRequests", JSON.stringify([newRequest]));

    alert("Request Submitted! Forwarding to Warden for Approval...");

    // Navigate to Warden Approval Page
    navigate("/warden");
  };

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">New Movement Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={request.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block text-gray-700">Branch</label>
            <select
              name="branch"
              value={request.branch}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Semester Dropdown */}
          <div>
            <label className="block text-gray-700">Semester</label>
            <select
              name="semester"
              value={request.semester}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-gray-700">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={request.purpose}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              placeholder="Enter purpose"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-gray-700">Destination</label>
            <input
              type="text"
              name="destination"
              value={request.destination}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              placeholder="Enter destination"
            />
          </div>

          {/* Date Field (Restricted to Current & Future Dates) */}
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={request.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              min={today} // Restricts to current and future dates
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Request1;
